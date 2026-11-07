'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Cpu, Activity, CheckCircle2, AlertTriangle, PauseCircle } from 'lucide-react';
import { formatRelative } from '@/lib/format';
import type { AutomationWithLogs, FlowStatus } from '@/lib/types';

// ============================================================
// Mi Oficina IA (v3) — motor PixiJS (WebGL). Adaptado del enfoque de
// paulrobello/claude-office (MIT): oficina de agentes. Arte procedural
// on-brand con una capa de glow/bloom; cada automatizacion del cliente es
// un agente que trabaja y camina. Sin assets externos (arte propio).
// ============================================================

const TOP_WALL = 104;
const ROW_H = 176;
const LOUNGE_H = 70;

const STATUS_HEX: Record<FlowStatus, number> = { activo: 0xccff00, pausa: 0xeab308, error: 0xff5964 };
const STATUS_META: Record<FlowStatus, { label: string; badge: string; Icon: typeof CheckCircle2 }> = {
  activo: { label: 'Trabajando', badge: 'bg-green-500/10 text-green-300 border-green-500/30', Icon: CheckCircle2 },
  pausa: { label: 'En pausa', badge: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30', Icon: PauseCircle },
  error: { label: 'En error', badge: 'bg-red-500/10 text-red-300 border-red-500/30', Icon: AlertTriangle },
};
const AREA_LABEL: Record<string, string> = { marketing: 'Marketing', ventas: 'Ventas', operaciones: 'Operaciones', soporte: 'Soporte' };
const AREA_HEX: Record<string, number> = { ventas: 0x1ea7a0, marketing: 0x9fbe1f, operaciones: 0x4f79c9, soporte: 0x8a63c9 };
const HAIR = [0x2a2f3a, 0x4a3524, 0x6b4a2a, 0x1b1b1b, 0x5a3a4a];

function areaHex(a: string | null) { return (a && AREA_HEX[a]) || 0x5b6677; }
function hairHex(seed: string) { let h = 0; for (let i = 0; i < seed.length; i++) h = (h + seed.charCodeAt(i)) % HAIR.length; return HAIR[h]; }

type Rt = {
  id: string; homeX: number; homeY: number; x: number; y: number;
  phase: 'desk' | 'out' | 'lounge' | 'back'; until: number; tx: number; ty: number;
  facing: 1 | -1; blinkUntil: number; nextBlink: number; appear: number;
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
      const PIXI = await import('pixi.js');
      if (destroyed || !mountRef.current) return;

      const reduce =
        typeof window !== 'undefined' && typeof window.matchMedia === 'function'
          ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

      let width = mount.clientWidth || 980;
      let cols = Math.max(1, Math.min(4, Math.floor(width / 280)));
      let rows = Math.max(1, Math.ceil(automations.length / cols));
      let height = TOP_WALL + rows * ROW_H + LOUNGE_H;

      const app = new PIXI.Application();
      await app.init({
        width, height, background: 0x06080f, antialias: true,
        resolution: Math.min(window.devicePixelRatio || 1, 2), autoDensity: true,
      });
      if (destroyed) { app.destroy(true, { children: true }); return; }
      mount.appendChild(app.canvas);
      app.canvas.style.width = '100%';
      app.canvas.style.display = 'block';

      // Capas
      const bg = new PIXI.Graphics();
      const screens = new PIXI.Graphics();          // pantallas de monitor (dinamico)
      const glow = new PIXI.Graphics();             // capa de bloom
      glow.filters = [new PIXI.BlurFilter({ strength: 9, quality: 3 })];
      glow.blendMode = 'add';
      const desks = new PIXI.Graphics();
      const charsLayer = new PIXI.Container();
      charsLayer.sortableChildren = true;
      const ui = new PIXI.Container();
      app.stage.addChild(bg, glow, desks, screens, charsLayer, ui);

      // Tooltip reutilizable
      const tipBg = new PIXI.Graphics();
      const tipTxt = new PIXI.Text({ text: '', style: { fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: '600', fill: 0xffffff } });
      const tip = new PIXI.Container(); tip.addChild(tipBg, tipTxt); tip.visible = false; ui.addChild(tip);

      const loungeX = () => width * 0.5;
      const loungeY = () => height - LOUNGE_H + 30;
      const rnd = (a: number, b: number) => a + Math.random() * (b - a);

      // Estado por agente + display objects
      const rt = new Map<string, Rt>();
      const node = new Map<string, { c: InstanceType<typeof PIXI.Container>; body: InstanceType<typeof PIXI.Graphics>; name: InstanceType<typeof PIXI.Text> }>();

      automations.forEach((a) => {
        const c = new PIXI.Container();
        c.eventMode = 'static'; c.cursor = 'pointer';
        c.hitArea = new PIXI.Rectangle(-46, -62, 92, 104);
        const body = new PIXI.Graphics();
        const name = new PIXI.Text({ text: a.name.length > 22 ? a.name.slice(0, 20) + '…' : a.name, style: { fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: '600', fill: 0xc9d1d9, align: 'center' } });
        name.anchor.set(0.5, 0); name.y = 30;
        c.addChild(body, name);
        c.on('pointerover', () => { hoverRef.current = a.id; });
        c.on('pointerout', () => { if (hoverRef.current === a.id) hoverRef.current = null; });
        c.on('pointertap', () => selectRef.current(a.id));
        charsLayer.addChild(c);
        node.set(a.id, { c, body, name });
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
          const hy = TOP_WALL + Math.floor(i / cols) * ROW_H + 92;
          const ex = rt.get(a.id);
          if (ex) { ex.homeX = hx; ex.homeY = hy; if (ex.phase === 'desk') { ex.x = hx; ex.y = hy; } }
          else rt.set(a.id, {
            id: a.id, homeX: hx, homeY: hy, x: hx, y: hy, phase: 'desk', until: 0, tx: hx, ty: hy,
            facing: 1, blinkUntil: 0, nextBlink: performance.now() + rnd(1500, 5000), appear: reduce ? 1 : 0,
          });
        });
        drawStatic();
      };

      // --- Estatico: piso, pared, ventanal, lounge, escritorios ---
      const drawStatic = () => {
        bg.clear();
        bg.rect(0, 0, width, height).fill(0x06080f);
        bg.rect(0, TOP_WALL, width, height - TOP_WALL).fill(0x080b13);
        for (let x = 0; x <= width; x += 46) bg.rect(x, TOP_WALL, 1, height - TOP_WALL).fill({ color: 0xccff00, alpha: 0.04 });
        for (let y = TOP_WALL; y <= height; y += 46) bg.rect(0, y, width, 1).fill({ color: 0xccff00, alpha: 0.04 });
        bg.rect(0, 0, width, TOP_WALL).fill(0x0b0f17);
        bg.rect(0, TOP_WALL - 3, width, 3).fill(0x11161f);
        // ventanal
        const wx = 30, wy = 20, ww = Math.min(380, width - 340), wh = 60;
        if (ww > 140) {
          bg.rect(wx, wy, ww, wh).fill(0x05080f);
          bg.rect(wx, wy, ww, wh).stroke({ color: 0xffffff, alpha: 0.08, width: 1 });
        }
        // reloj
        bg.circle(width - 50, 46, 16).stroke({ color: 0xffffff, alpha: 0.15, width: 2 });
        // lounge
        bg.ellipse(loungeX(), loungeY() + 6, 120, 28).fill({ color: 0x00ffcc, alpha: 0.05 });
        bg.rect(loungeX() - 160, loungeY() - 28, 12, 15).fill(0x2a1f14);
        bg.rect(loungeX() + 140, loungeY() - 22, 16, 20).fill(0x11161f);

        // escritorios en sus posiciones de casa
        desks.clear();
        for (const a of automations) {
          const r = rt.get(a.id); if (!r) continue;
          const cx = r.homeX, dy = r.homeY + 30;
          desks.ellipse(cx, dy + 36, 78, 9).fill({ color: 0x000000, alpha: 0.3 });
          desks.rect(cx - 76, dy, 152, 7).fill(0x141a24);
          desks.rect(cx - 76, dy + 7, 152, 15).fill(0x0b0e14);
          desks.rect(cx - 70, dy + 22, 6, 14).fill(0x0b0e14);
          desks.rect(cx + 64, dy + 22, 6, 14).fill(0x0b0e14);
          desks.rect(cx + 20, dy - 40, 56, 40).fill(0x05070c); // marco monitor
        }
      };

      // --- Personaje ---
      const drawBody = (a: AutomationWithLogs, r: Rt, t: number) => {
        const n = node.get(a.id); if (!n) return;
        const status = (a.status as FlowStatus) ?? 'activo';
        const g = n.body; g.clear();
        const P = 5, shirt = areaHex(a.area), hair = hairHex(a.name);
        const seated = r.phase === 'desk';
        const walking = r.phase === 'out' || r.phase === 'back';
        const bob = status === 'activo' ? Math.sin(t / 190) * 1.5 : 0;
        const topY = (seated ? -34 : -38) + bob;
        const footY = 26;
        // piernas de pie
        if (!seated) {
          const sw = walking ? Math.sin(t / 90) * 4 : 0;
          g.rect(-4 * P, footY - 5 * P, 3 * P, 5 * P).fill(0x20252e);
          g.rect(1 * P, footY - 5 * P, 3 * P, 5 * P).fill(0x20252e);
          g.rect(-4 * P + sw, footY - P, 3 * P, 2 * P).fill(0x11151d);
          g.rect(1 * P - sw, footY - P, 3 * P, 2 * P).fill(0x11151d);
        }
        g.rect(-5 * P, topY + 7 * P, 10 * P, 6 * P).fill(shirt);
        g.rect(-5 * P, topY + 7 * P, 10 * P, P).fill({ color: 0xffffff, alpha: 0.12 });
        g.rect(-P, topY + 8.5 * P, 2 * P, 2 * P).fill(STATUS_HEX[status]);
        g.rect(-2 * P, topY + 6 * P, 4 * P, 1.4 * P).fill(0xe8b48c);
        g.rect(-4 * P, topY + P, 8 * P, 6 * P).fill(0xf1c9a5);
        g.rect(-4 * P, topY, 8 * P, 2 * P).fill(hair);
        g.rect(-4 * P, topY + P, 1.2 * P, 3 * P).fill(hair);
        g.rect(2.8 * P, topY + P, 1.2 * P, 3 * P).fill(hair);
        const blink = t < r.blinkUntil || status === 'pausa';
        if (blink) {
          g.rect(-2.6 * P, topY + 3.6 * P, 1.4 * P, 0.6 * P).fill(0x3a2f2f);
          g.rect(1.2 * P, topY + 3.6 * P, 1.4 * P, 0.6 * P).fill(0x3a2f2f);
        } else {
          const lk = r.facing > 0 ? 0.3 : -0.3;
          g.rect((-2.4 + lk) * P, topY + 3.2 * P, 1.2 * P, 1.2 * P).fill(0x1b1f2a);
          g.rect((1.2 + lk) * P, topY + 3.2 * P, 1.2 * P, 1.2 * P).fill(0x1b1f2a);
        }
        if (seated) {
          const ty = status === 'activo' && Math.floor(t / 150) % 2 === 0 ? 0 : 1;
          g.rect(-6 * P, topY + 11 * P + ty, 2 * P, 3 * P).fill(shirt);
          g.rect(4 * P, topY + 11 * P + (1 - ty), 2 * P, 3 * P).fill(shirt);
        } else {
          const sw = walking ? Math.sin(t / 90) * 3 : 0;
          g.rect(-6 * P, topY + 8 * P + sw, 2 * P, 4 * P).fill(shirt);
          g.rect(4 * P, topY + 8 * P - sw, 2 * P, 4 * P).fill(shirt);
        }
        n.c.alpha = r.appear;
      };

      // --- Particulas (en la capa glow) ---
      const parts: { x: number; y: number; vy: number; life: number; c: number }[] = [];

      const step = (t: number, dt: number) => {
        for (const a of automations) {
          const r = rt.get(a.id); if (!r) continue;
          if (r.appear < 1) r.appear = Math.min(1, r.appear + dt / 600);
          if (t > r.nextBlink) { r.blinkUntil = t + 120; r.nextBlink = t + rnd(1800, 5200); }
          const status = (a.status as FlowStatus) ?? 'activo';
          if (reduce || status !== 'activo') { r.phase = 'desk'; r.x = r.homeX; r.y = r.homeY; continue; }
          const sp = 0.075 * dt;
          if (r.phase === 'desk') {
            if (r.until === 0) r.until = t + rnd(9000, 22000);
            if (t > r.until) { r.phase = 'out'; r.tx = loungeX() + rnd(-100, 100); r.ty = loungeY() + rnd(-8, 8); r.until = 0; }
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
        // skyline glow en el ventanal
        const wx = 30, wy = 20, ww = Math.min(380, width - 340), wh = 60;
        if (ww > 140) for (let i = 0; i < 14; i++) {
          const bx = wx + 6 + i * (ww / 14), bh = 10 + ((i * 37) % 38);
          glow.rect(bx, wy + wh - bh, ww / 14 - 3, bh).fill({ color: i % 3 === 0 ? 0x00ffcc : 0xccff00, alpha: 0.5 });
        }
        for (const a of automations) {
          const r = rt.get(a.id); if (!r) continue;
          const status = (a.status as FlowStatus) ?? 'activo';
          const sc = STATUS_HEX[status];
          // pantalla + glow del monitor (en casa)
          const mx = r.homeX + 20, my = r.homeY + 30 - 38;
          const scr = status === 'error' && Math.floor(t / 300) % 2 ? 0xff5964 : sc;
          screens.rect(mx + 5, my + 5, 46, 30).fill({ color: scr, alpha: 0.16 });
          for (let i = 0; i < 4; i++) {
            const lw = status === 'activo' ? (10 + ((Math.floor(t / 180) + i) % 5) * 7) : (10 + i * 7);
            screens.rect(mx + 8, my + 9 + i * 7, Math.min(lw, 40), 3).fill({ color: sc, alpha: 0.85 });
          }
          const gi = status === 'activo' ? 0.5 : status === 'error' ? (Math.floor(t / 300) % 2 ? 0.6 : 0.15) : 0.25;
          glow.rect(mx, my, 56, 40).fill({ color: scr, alpha: gi });
          // aura bajo el agente (sigue su posicion)
          glow.ellipse(r.x, r.y + 28, 22, 7).fill({ color: sc, alpha: status === 'pausa' ? 0.25 : 0.45 });
          // particula
          if (!reduce && r.phase === 'desk' && status === 'activo' && Math.random() < 0.03)
            parts.push({ x: mx + 28, y: my, vy: -0.4 - Math.random() * 0.4, life: 1, c: 0xccff00 });

          // posicion + dibujo del personaje
          const n = node.get(a.id); if (n) { n.c.x = r.x; n.c.y = r.y; n.c.zIndex = r.y; }
          drawBody(a, r, t);
        }
        // particulas
        for (let i = parts.length - 1; i >= 0; i--) {
          const p = parts[i]; p.y += p.vy; p.life -= 0.012;
          if (p.life <= 0) { parts.splice(i, 1); continue; }
          glow.rect(p.x, p.y, 3, 3).fill({ color: p.c, alpha: p.life * 0.8 });
        }
        // tooltip
        const hid = hoverRef.current;
        if (hid) {
          const a = automations.find((x) => x.id === hid); const r = rt.get(hid);
          if (a && r) {
            const status = (a.status as FlowStatus) ?? 'activo';
            tipTxt.text = `${a.name}  ·  ${STATUS_META[status].label}`;
            const w = tipTxt.width + 20;
            tipBg.clear(); tipBg.roundRect(0, 0, w, 24, 7).fill({ color: 0x02040a, alpha: 0.95 }).stroke({ color: STATUS_HEX[status], alpha: 0.6, width: 1 });
            tipTxt.x = 10; tipTxt.y = 6;
            tip.x = Math.max(6, Math.min(width - w - 6, r.x - w / 2)); tip.y = r.y - 58; tip.visible = true;
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
