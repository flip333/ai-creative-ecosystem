'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Cpu, Activity, CheckCircle2, AlertTriangle, PauseCircle } from 'lucide-react';
import { formatRelative } from '@/lib/format';
import type { AutomationWithLogs, FlowStatus } from '@/lib/types';
import { charSVG, DESK_SVG, MONITOR_SVG, PLANT_SVG, COFFEE_SVG } from './officeSprites';

// ============================================================
// Mi Oficina IA (v4) — motor PixiJS (WebGL) con sprites SVG propios.
// Enfoque adaptado de paulrobello/claude-office (MIT); arte 100% propio
// (officeSprites.ts), sin assets externos. Cada automatizacion es un agente
// con su sprite; trabaja, camina al lounge, y el estado manda el glow/bloom.
// ============================================================

const TOP_WALL = 104;
const ROW_H = 180;
const LOUNGE_H = 74;

const STATUS_HEX: Record<FlowStatus, number> = { activo: 0xccff00, pausa: 0xeab308, error: 0xff5964 };
const STATUS_META: Record<FlowStatus, { label: string; badge: string; Icon: typeof CheckCircle2 }> = {
  activo: { label: 'Trabajando', badge: 'bg-green-500/10 text-green-300 border-green-500/30', Icon: CheckCircle2 },
  pausa: { label: 'En pausa', badge: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30', Icon: PauseCircle },
  error: { label: 'En error', badge: 'bg-red-500/10 text-red-300 border-red-500/30', Icon: AlertTriangle },
};
const AREA_LABEL: Record<string, string> = { marketing: 'Marketing', ventas: 'Ventas', operaciones: 'Operaciones', soporte: 'Soporte' };

// Paleta de personaje por area: [camiseta, sombra, pelo]
const CHAR_PALETTE: Record<string, [string, string, string]> = {
  ventas: ['#1ea7a0', '#156b66', '#2a2f3a'],
  marketing: ['#9fbe1f', '#6e840f', '#4a3524'],
  operaciones: ['#4f79c9', '#32508f', '#1b1b1b'],
  soporte: ['#8a63c9', '#5f407e', '#5a3a4a'],
  _: ['#5b6677', '#3b4452', '#2a2f3a'],
};

type Rt = {
  id: string; homeX: number; homeY: number; x: number; y: number;
  phase: 'desk' | 'out' | 'lounge' | 'back'; until: number; tx: number; ty: number;
  facing: 1 | -1; appear: number;
};

export function ClientOfficePixi({ automations }: { automations: AutomationWithLogs[] }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<string | null>(null);
  const selectRef = useRef<(id: string | null) => void>(() => {});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = automations.find((a) => a.id === selectedId) ?? null;
  useEffect(() => { selectRef.current = setSelectedId; }, []);

  useEffect(() => {
    if (automations.length === 0) return;
    const mount = mountRef.current;
    if (!mount) return;
    let destroyed = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      try {
        const PIXI = await import('pixi.js');
        if (destroyed || !mountRef.current) return;

        const reduce =
          typeof window !== 'undefined' && typeof window.matchMedia === 'function'
            ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

        const svgTex = (svg: string): Promise<InstanceType<typeof PIXI.Texture>> =>
          new Promise((res, rej) => {
            const img = new Image();
            img.decoding = 'async';
            img.onload = () => res(PIXI.Texture.from(img));
            img.onerror = rej;
            img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
          });

        const [texDesk, texMon, texPlant, texCoffee] = await Promise.all([
          svgTex(DESK_SVG), svgTex(MONITOR_SVG), svgTex(PLANT_SVG), svgTex(COFFEE_SVG),
        ]);
        const charTex: Record<string, InstanceType<typeof PIXI.Texture>> = {};
        for (const k of Object.keys(CHAR_PALETTE)) {
          const [s, d, h] = CHAR_PALETTE[k];
          charTex[k] = await svgTex(charSVG(s, d, h));
        }
        if (destroyed) return;

        let width = mount.clientWidth || 980;
        let cols = Math.max(1, Math.min(4, Math.floor(width / 280)));
        let rows = Math.max(1, Math.ceil(automations.length / cols));
        let height = TOP_WALL + rows * ROW_H + LOUNGE_H;

        const app = new PIXI.Application();
        await app.init({ width, height, background: 0x06080f, antialias: true, resolution: Math.min(window.devicePixelRatio || 1, 2), autoDensity: true });
        if (destroyed) { app.destroy(true, { children: true }); return; }
        mount.appendChild(app.canvas);
        app.canvas.style.width = '100%';
        app.canvas.style.display = 'block';

        const bg = new PIXI.Graphics();
        const deskLayer = new PIXI.Container();
        const screens = new PIXI.Graphics();
        const glow = new PIXI.Graphics();
        glow.filters = [new PIXI.BlurFilter({ strength: 10, quality: 3 })];
        glow.blendMode = 'add';
        const charsLayer = new PIXI.Container();
        charsLayer.sortableChildren = true;
        const ui = new PIXI.Container();
        app.stage.addChild(bg, deskLayer, screens, glow, charsLayer, ui);

        const tipBg = new PIXI.Graphics();
        const tipTxt = new PIXI.Text({ text: '', style: { fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: '600', fill: 0xffffff } });
        const tip = new PIXI.Container(); tip.addChild(tipBg, tipTxt); tip.visible = false; ui.addChild(tip);

        const loungeX = () => width * 0.5;
        const loungeY = () => height - LOUNGE_H + 34;
        const rnd = (a: number, b: number) => a + Math.random() * (b - a);

        // props del lounge
        const plant = new PIXI.Sprite(texPlant); plant.anchor.set(0.5, 1); plant.scale.set(0.5);
        const coffee = new PIXI.Sprite(texCoffee); coffee.anchor.set(0.5, 1); coffee.scale.set(0.5);
        plant.zIndex = 99999; coffee.zIndex = 99999; charsLayer.addChild(plant, coffee);

        const rt = new Map<string, Rt>();
        const node = new Map<string, { c: InstanceType<typeof PIXI.Container>; sp: InstanceType<typeof PIXI.Sprite>; name: InstanceType<typeof PIXI.Text>; desk: InstanceType<typeof PIXI.Sprite>; mon: InstanceType<typeof PIXI.Sprite> }>();

        automations.forEach((a) => {
          const desk = new PIXI.Sprite(texDesk); desk.anchor.set(0.5, 0.5); desk.scale.set(150 / 156);
          const mon = new PIXI.Sprite(texMon); mon.anchor.set(0.5, 1); mon.scale.set(56 / 60);
          deskLayer.addChild(desk, mon);

          const c = new PIXI.Container();
          c.eventMode = 'static'; c.cursor = 'pointer';
          c.hitArea = new PIXI.Rectangle(-26, -62, 52, 70);
          const sp = new PIXI.Sprite(charTex[a.area && CHAR_PALETTE[a.area] ? a.area : '_']);
          sp.anchor.set(0.5, 1); sp.scale.set(1);
          const name = new PIXI.Text({ text: a.name.length > 22 ? a.name.slice(0, 20) + '…' : a.name, style: { fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: '600', fill: 0xc9d1d9, align: 'center' } });
          name.anchor.set(0.5, 0); name.y = 10;
          c.addChild(sp, name);
          c.on('pointerover', () => { hoverRef.current = a.id; });
          c.on('pointerout', () => { if (hoverRef.current === a.id) hoverRef.current = null; });
          c.on('pointertap', () => selectRef.current(a.id));
          charsLayer.addChild(c);
          node.set(a.id, { c, sp, name, desk, mon });
        });

        const layout = () => {
          width = mount.clientWidth || width;
          cols = Math.max(1, Math.min(4, Math.floor(width / 280)));
          rows = Math.max(1, Math.ceil(automations.length / cols));
          height = TOP_WALL + rows * ROW_H + LOUNGE_H;
          app.renderer.resize(width, height);
          const cellW = width / cols;
          automations.forEach((a, i) => {
            const hx = (i % cols) * cellW + cellW / 2;
            const hy = TOP_WALL + Math.floor(i / cols) * ROW_H + 96;
            const ex = rt.get(a.id);
            if (ex) { ex.homeX = hx; ex.homeY = hy; if (ex.phase === 'desk') { ex.x = hx; ex.y = hy; } }
            else rt.set(a.id, { id: a.id, homeX: hx, homeY: hy, x: hx, y: hy, phase: 'desk', until: 0, tx: hx, ty: hy, facing: 1, appear: reduce ? 1 : 0 });
            const n = node.get(a.id);
            if (n) { n.desk.position.set(hx, hy + 20); n.mon.position.set(hx + 34, hy + 6); }
          });
          plant.position.set(loungeX() - 150, loungeY() + 6);
          coffee.position.set(loungeX() + 150, loungeY() + 6);
          drawStatic();
        };

        const drawStatic = () => {
          bg.clear();
          bg.rect(0, 0, width, height).fill(0x06080f);
          bg.rect(0, TOP_WALL, width, height - TOP_WALL).fill(0x080b13);
          for (let x = 0; x <= width; x += 46) bg.rect(x, TOP_WALL, 1, height - TOP_WALL).fill({ color: 0xccff00, alpha: 0.035 });
          for (let y = TOP_WALL; y <= height; y += 46) bg.rect(0, y, width, 1).fill({ color: 0xccff00, alpha: 0.035 });
          bg.rect(0, 0, width, TOP_WALL).fill(0x0b0f17);
          bg.rect(0, TOP_WALL - 3, width, 3).fill(0x11161f);
          const ww = Math.min(380, width - 340);
          if (ww > 140) bg.rect(30, 20, ww, 60).fill(0x05080f).stroke({ color: 0xffffff, alpha: 0.08, width: 1 });
          bg.circle(width - 50, 46, 16).stroke({ color: 0xffffff, alpha: 0.15, width: 2 });
          bg.ellipse(loungeX(), loungeY() + 10, 150, 30).fill({ color: 0x00ffcc, alpha: 0.05 });
        };

        const parts: { x: number; y: number; vy: number; life: number; c: number }[] = [];

        const step = (t: number, dt: number) => {
          for (const a of automations) {
            const r = rt.get(a.id); if (!r) continue;
            if (r.appear < 1) r.appear = Math.min(1, r.appear + dt / 600);
            const status = (a.status as FlowStatus) ?? 'activo';
            if (reduce || status !== 'activo') { r.phase = 'desk'; r.x = r.homeX; r.y = r.homeY; continue; }
            const sp = 0.075 * dt;
            if (r.phase === 'desk') {
              if (r.until === 0) r.until = t + rnd(9000, 22000);
              if (t > r.until) { r.phase = 'out'; r.tx = loungeX() + rnd(-110, 110); r.ty = loungeY() + rnd(-8, 8); r.until = 0; }
            } else if (r.phase === 'out' || r.phase === 'back') {
              const gx = r.phase === 'out' ? r.tx : r.homeX, gy = r.phase === 'out' ? r.ty : r.homeY;
              const dx = gx - r.x, dy = gy - r.y, d = Math.hypot(dx, dy); r.facing = dx >= 0 ? 1 : -1;
              if (d < 2) { if (r.phase === 'out') { r.phase = 'lounge'; r.until = t + rnd(3500, 7000); } else { r.phase = 'desk'; r.x = r.homeX; r.y = r.homeY; r.until = t + rnd(9000, 22000); } }
              else { r.x += (dx / d) * Math.min(sp, d); r.y += (dy / d) * Math.min(sp, d); }
            } else if (r.phase === 'lounge') { if (t > r.until) r.phase = 'back'; }
          }
        };

        const render = (t: number) => {
          screens.clear(); glow.clear();
          const ww = Math.min(380, width - 340);
          if (ww > 140) for (let i = 0; i < 14; i++) {
            const bx = 36 + i * (ww / 14), bh = 10 + ((i * 37) % 38);
            glow.rect(bx, 80 - bh, ww / 14 - 3, bh).fill({ color: i % 3 === 0 ? 0x00ffcc : 0xccff00, alpha: 0.5 });
          }
          for (const a of automations) {
            const r = rt.get(a.id); const n = node.get(a.id); if (!r || !n) continue;
            const status = (a.status as FlowStatus) ?? 'activo';
            const sc = STATUS_HEX[status];
            const mcx = r.homeX + 34, mcy = r.homeY + 6 - 26; // centro del monitor
            const scr = status === 'error' && Math.floor(t / 300) % 2 ? 0xff5964 : sc;
            screens.rect(mcx - 18, mcy - 13, 36, 26).fill({ color: scr, alpha: 0.18 });
            for (let i = 0; i < 4; i++) {
              const lw = status === 'activo' ? (8 + ((Math.floor(t / 180) + i) % 5) * 6) : (8 + i * 6);
              screens.rect(mcx - 15, mcy - 10 + i * 6, Math.min(lw, 30), 2.4).fill({ color: sc, alpha: 0.85 });
            }
            const gi = status === 'activo' ? 0.5 : status === 'error' ? (Math.floor(t / 300) % 2 ? 0.6 : 0.15) : 0.25;
            glow.rect(mcx - 26, mcy - 20, 52, 40).fill({ color: scr, alpha: gi });
            glow.ellipse(r.x, r.y, 24, 7).fill({ color: sc, alpha: status === 'pausa' ? 0.25 : 0.45 });
            if (!reduce && r.phase === 'desk' && status === 'activo' && Math.random() < 0.03)
              parts.push({ x: mcx, y: mcy - 16, vy: -0.4 - Math.random() * 0.4, life: 1, c: 0xccff00 });

            // posicion del personaje
            const bob = status === 'activo' ? Math.sin(t / 190) * 2 : 0;
            n.c.x = r.x; n.c.y = r.y; n.c.zIndex = r.y;
            n.sp.y = bob; n.sp.scale.x = r.facing;
            n.sp.rotation = (r.phase === 'out' || r.phase === 'back') ? Math.sin(t / 110) * 0.05 : 0;
            n.c.alpha = r.appear;
          }
          // sort lounge props depth
          plant.zIndex = plant.y; coffee.zIndex = coffee.y;

          for (let i = parts.length - 1; i >= 0; i--) {
            const p = parts[i]; p.y += p.vy; p.life -= 0.012;
            if (p.life <= 0) { parts.splice(i, 1); continue; }
            glow.rect(p.x, p.y, 3, 3).fill({ color: p.c, alpha: p.life * 0.8 });
          }

          const hid = hoverRef.current;
          if (hid) {
            const a = automations.find((x) => x.id === hid); const r = rt.get(hid);
            if (a && r) {
              const status = (a.status as FlowStatus) ?? 'activo';
              tipTxt.text = `${a.name}  ·  ${STATUS_META[status].label}`;
              const w = tipTxt.width + 20;
              tipBg.clear(); tipBg.roundRect(0, 0, w, 24, 7).fill({ color: 0x02040a, alpha: 0.95 }).stroke({ color: STATUS_HEX[status], alpha: 0.6, width: 1 });
              tipTxt.x = 10; tipTxt.y = 6;
              tip.x = Math.max(6, Math.min(width - w - 6, r.x - w / 2)); tip.y = r.y - 86; tip.visible = true;
            }
          } else tip.visible = false;
        };

        layout();
        let last = performance.now();
        app.ticker.add(() => {
          const now = performance.now(); const dt = Math.min(48, now - last); last = now;
          try { step(now, dt); render(now); } catch (e) { console.error('Pixi office error:', e); app.ticker.stop(); }
        });

        const ro = new ResizeObserver(() => layout());
        ro.observe(mount);
        cleanup = () => { ro.disconnect(); app.destroy(true, { children: true, texture: true }); };
      } catch (e) {
        console.error('Oficina PixiJS init failed:', e);
      }
    })();

    return () => { destroyed = true; if (cleanup) cleanup(); };
  }, [automations]);

  if (automations.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <OfficeIntro total={0} activos={0} />
        <div className="bg-[#0d1117] border border-white/5 rounded-3xl p-14 text-center flex flex-col items-center gap-3">
          <Cpu className="w-8 h-8 text-zinc-600" />
          <p className="text-zinc-400 text-sm max-w-sm">
            Tu oficina está lista pero aún no tiene agentes. En cuanto tu consultor active tu
            primera automatización, aparecerá aquí como un agente trabajando para ti.
          </p>
        </div>
      </div>
    );
  }

  const activos = automations.filter((a) => a.status === 'activo').length;

  return (
    <div className="flex flex-col gap-6">
      <OfficeIntro total={automations.length} activos={activos} />
      <div className="relative w-full overflow-hidden rounded-3xl border border-[#ccff00]/15 bg-[#06080f]">
        <div ref={mountRef} className="w-full" />
        <div className="pointer-events-none absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
          Pasa el mouse sobre un agente · click para ver qué hace
        </div>
      </div>

      {selected && (
        <>
          <div onClick={() => setSelectedId(null)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
          <aside className="fixed top-0 right-0 bottom-0 w-[440px] max-w-[92vw] bg-[#0d1117] border-l border-[#ccff00]/20 shadow-2xl z-50 flex flex-col">
            <div className="p-7 border-b border-white/5 flex items-start justify-between">
              <div className="flex flex-col gap-1.5 min-w-0">
                <span className="font-mono text-[10px] tracking-widest uppercase text-[#ccff00]">Agente IA</span>
                <h2 className="font-display text-xl font-medium text-white tracking-tight truncate">{selected.name}</h2>
                <StatusPill status={selected.status as FlowStatus} />
              </div>
              <button onClick={() => setSelectedId(null)} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-7 flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-3">
                <Fact label="Área" value={selected.area ? (AREA_LABEL[selected.area] ?? selected.area) : '—'} />
                <Fact label="Stack" value={selected.stack ?? '—'} />
                <Fact label="Resultado" value={selected.kpi_result ?? '—'} accent />
                <Fact label="Costo / mes" value={`$${Number(selected.monthly_cost ?? 0).toFixed(2)}`} />
              </div>
              {selected.master_prompt && (
                <div>
                  <div className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 mb-2">Qué hace</div>
                  <p className="text-sm text-zinc-300 bg-black/40 border border-white/5 rounded-2xl p-4 leading-relaxed">{selected.master_prompt}</p>
                </div>
              )}
              <div>
                <div className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 mb-2 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5" /> Últimas ejecuciones
                </div>
                {selected.automation_logs.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {selected.automation_logs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between gap-3 bg-black/40 border border-white/5 rounded-xl px-3.5 py-2.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${log.status === 'success' ? 'bg-green-400' : 'bg-red-400'}`} />
                          <span className="text-xs text-zinc-300 truncate">{log.message ?? (log.status === 'success' ? 'Ejecución correcta' : 'Error')}</span>
                        </div>
                        <span className="font-mono text-[10px] text-zinc-500 shrink-0">{formatRelative(log.created_at)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500">Sin ejecuciones registradas todavía.</p>
                )}
              </div>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

function OfficeIntro({ total, activos }: { total: number; activos: number }) {
  return (
    <section className="bg-gradient-to-br from-[#0d1117] to-black border border-[#ccff00]/15 rounded-3xl p-6 flex items-center justify-between gap-6 flex-wrap">
      <div>
        <div className="font-mono text-[10px] tracking-widest uppercase text-[#ccff00] mb-2 flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5" /> Tu equipo de agentes IA
        </div>
        <p className="text-sm text-zinc-400 max-w-xl">
          Cada automatización que Genflow opera para ti es un agente en tu oficina. Los que
          trabajan a veces se levantan por un café; haz clic en cualquiera para ver qué hace.
        </p>
      </div>
      <div className="flex gap-4">
        <div className="text-center">
          <div className="font-display text-3xl font-medium text-white">{total}</div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">agentes</div>
        </div>
        <div className="text-center">
          <div className="font-display text-3xl font-medium text-[#ccff00]">{activos}</div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">activos</div>
        </div>
      </div>
    </section>
  );
}

function StatusPill({ status }: { status: FlowStatus }) {
  const m = STATUS_META[status] ?? STATUS_META.activo; const Icon = m.Icon;
  return (
    <span className={`inline-flex items-center gap-1.5 w-fit font-mono text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full border ${m.badge}`}>
      <Icon className="w-3 h-3" /> {m.label}
    </span>
  );
}

function Fact({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-black/40 border border-white/5 rounded-2xl p-3.5 min-w-0">
      <div className="font-mono text-[9px] tracking-widest uppercase text-zinc-500 mb-1">{label}</div>
      <div className={`text-sm font-medium truncate ${accent ? 'text-[#ccff00]' : 'text-white'}`}>{value}</div>
    </div>
  );
}
