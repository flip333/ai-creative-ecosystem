'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Cpu, Activity, CheckCircle2, AlertTriangle, PauseCircle } from 'lucide-react';
import { formatRelative } from '@/lib/format';
import type { AutomationWithLogs, FlowStatus } from '@/lib/types';

// ============================================================
// Mi Oficina IA — cada automatizacion del cliente es un agente
// (personaje pixel dibujado por codigo) en una oficina. El estado
// del flujo manda la animacion: trabajando / en pausa / en error.
// Sin assets externos: todo se dibuja en <canvas>.
// ============================================================

const CELL_W = 260;
const CELL_H = 220;

type Box = { id: string; x: number; y: number; w: number; h: number };

const STATUS_COLOR: Record<FlowStatus, string> = {
  activo: '#ccff00',
  pausa: '#eab308',
  error: '#ff5964',
};

const STATUS_META: Record<FlowStatus, { label: string; badge: string; Icon: typeof CheckCircle2 }> = {
  activo: { label: 'Trabajando', badge: 'bg-green-500/10 text-green-300 border-green-500/30', Icon: CheckCircle2 },
  pausa: { label: 'En pausa', badge: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30', Icon: PauseCircle },
  error: { label: 'En error', badge: 'bg-red-500/10 text-red-300 border-red-500/30', Icon: AlertTriangle },
};

const AREA_LABEL: Record<string, string> = {
  marketing: 'Marketing', ventas: 'Ventas', operaciones: 'Operaciones', soporte: 'Soporte',
};

// Color de camiseta estable por nombre (tonos apagados que no pelean con el lima).
function shirtColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  return `hsl(${h}, 45%, 55%)`;
}

export function ClientOffice({ automations }: { automations: AutomationWithLogs[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxesRef = useRef<Box[]>([]);
  // hover/seleccion en refs: el loop de dibujo las lee sin reiniciarse en cada mousemove.
  const hoverRef = useRef<string | null>(null);
  const selectedRef = useRef<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = automations.find((a) => a.id === selectedId) ?? null;

  useEffect(() => { selectedRef.current = selectedId; }, [selectedId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce =
      typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;

    let raf = 0;
    let width = 0;
    let height = 0;
    const particles: { x: number; y: number; vy: number; life: number; c: string }[] = [];

    const layout = () => {
      width = wrap.clientWidth;
      const cols = Math.max(1, Math.min(4, Math.floor(width / CELL_W)));
      const rows = Math.max(1, Math.ceil(automations.length / cols));
      const cellW = width / cols;
      height = rows * CELL_H + 24;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      boxesRef.current = automations.map((a, i) => ({
        id: a.id,
        x: (i % cols) * cellW,
        y: Math.floor(i / cols) * CELL_H + 12,
        w: cellW,
        h: CELL_H,
      }));
    };

    // ---- Dibujo del piso ----
    const drawFloor = () => {
      ctx.fillStyle = '#06080f';
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(204,255,0,0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= width; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y <= height; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }
    };

    const rect = (x: number, y: number, w: number, h: number, c: string) => {
      ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), Math.ceil(w), Math.ceil(h));
    };

    // ---- Dibujo de un agente ----
    const drawAgent = (a: AutomationWithLogs, box: Box, t: number) => {
      const status = (a.status as FlowStatus) ?? 'activo';
      const sc = STATUS_COLOR[status];
      const cx = box.x + box.w / 2;
      const deskY = box.y + box.h - 66;
      const px = 5; // tamano del "pixel"
      const hover = hoverRef.current === a.id || selectedRef.current === a.id;

      // Halo de seleccion/hover
      if (hover) {
        ctx.save();
        ctx.shadowColor = sc;
        ctx.shadowBlur = 24;
        ctx.strokeStyle = sc;
        ctx.lineWidth = 2;
        ctx.strokeRect(box.x + 10, box.y + 8, box.w - 20, box.h - 16);
        ctx.restore();
      }

      // Sombra bajo el escritorio
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      ctx.ellipse(cx, deskY + 70, box.w * 0.28, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Animacion segun estado
      const bob = status === 'activo' ? Math.sin(t / 220) * 2 : status === 'pausa' ? Math.sin(t / 700) * 1 : 0;
      const typing = status === 'activo' ? (Math.floor(t / 160) % 2 === 0 ? 1 : 0) : 0;

      // --- Personaje (detras del escritorio) ---
      const headY = deskY - 54 + bob;
      const shirt = shirtColor(a.name);
      // cuerpo
      rect(cx - 5 * px, headY + 7 * px, 10 * px, 6 * px, shirt);
      // cuello
      rect(cx - 2 * px, headY + 6 * px, 4 * px, 1.4 * px, '#e8b48c');
      // cabeza
      rect(cx - 4 * px, headY + 1 * px, 8 * px, 6 * px, '#f1c9a5');
      // pelo
      rect(cx - 4 * px, headY, 8 * px, 2 * px, '#2a2f3a');
      rect(cx - 4 * px, headY + 1 * px, 1.2 * px, 3 * px, '#2a2f3a');
      rect(cx + 2.8 * px, headY + 1 * px, 1.2 * px, 3 * px, '#2a2f3a');
      // ojos (o dormido en pausa)
      if (status === 'pausa') {
        rect(cx - 2.6 * px, headY + 3.6 * px, 1.4 * px, 0.6 * px, '#3a2f2f');
        rect(cx + 1.2 * px, headY + 3.6 * px, 1.4 * px, 0.6 * px, '#3a2f2f');
      } else {
        rect(cx - 2.4 * px, headY + 3.2 * px, 1.2 * px, 1.2 * px, '#1b1f2a');
        rect(cx + 1.2 * px, headY + 3.2 * px, 1.2 * px, 1.2 * px, '#1b1f2a');
      }
      // brazos (teclean cuando esta activo)
      const armY = deskY - 8 + (typing ? -2 : 0);
      rect(cx - 6 * px, armY, 2 * px, 3 * px, shirt);
      rect(cx + 4 * px, armY + (typing ? 2 : 0), 2 * px, 3 * px, shirt);

      // --- Escritorio ---
      rect(cx - box.w * 0.3, deskY + 40, box.w * 0.6, 8, '#11151d');
      rect(cx - box.w * 0.3, deskY + 48, box.w * 0.6, 18, '#0b0e14');
      // patas
      rect(cx - box.w * 0.28, deskY + 66, 5, 14, '#0b0e14');
      rect(cx + box.w * 0.28 - 5, deskY + 66, 5, 14, '#0b0e14');

      // --- Monitor (brilla segun estado) ---
      const monX = cx + 4 * px;
      const monY = deskY - 2;
      ctx.save();
      ctx.shadowColor = sc;
      ctx.shadowBlur = status === 'activo' ? 16 : status === 'error' ? (Math.floor(t / 300) % 2 ? 18 : 4) : 6;
      rect(monX, monY, 11 * px, 8 * px, '#05070c');
      ctx.restore();
      // pantalla
      const scr = status === 'error' && Math.floor(t / 300) % 2 ? 'rgba(255,89,100,0.25)' : `${hexA(sc, 0.18)}`;
      rect(monX + px, monY + px, 9 * px, 6 * px, scr);
      // lineas de codigo
      ctx.fillStyle = hexA(sc, 0.8);
      const lines = 4;
      for (let i = 0; i < lines; i++) {
        const lw = status === 'activo'
          ? (2 + ((Math.floor(t / 180) + i) % 5)) * px
          : (2 + i) * px;
        ctx.fillRect(monX + 1.6 * px, monY + (1.8 + i * 1.3) * px, Math.min(lw, 8 * px), 0.7 * px);
      }
      // pie del monitor
      rect(monX + 4.5 * px, monY + 8 * px, 2 * px, 1.4 * px, '#05070c');

      // --- Burbuja de estado ---
      if (status === 'pausa') {
        ctx.fillStyle = 'rgba(234,179,8,0.9)';
        ctx.font = 'bold 14px monospace';
        ctx.fillText('z', cx + 5 * px, headY - 2 + Math.sin(t / 300) * 2);
        ctx.font = 'bold 10px monospace';
        ctx.fillText('z', cx + 6.5 * px, headY - 8 + Math.sin(t / 300) * 2);
      } else if (status === 'error' && Math.floor(t / 400) % 2) {
        ctx.fillStyle = '#ff5964';
        ctx.beginPath();
        ctx.arc(cx + 5 * px, headY - 2, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('!', cx + 5 * px - 2, headY + 2);
      }

      // Particula de datos cuando trabaja
      if (status === 'activo' && !reduce && Math.random() < 0.03) {
        particles.push({ x: monX + 5 * px, y: monY, vy: -0.4 - Math.random() * 0.5, life: 1, c: sc });
      }

      // --- Placa con nombre ---
      ctx.fillStyle = hover ? '#ffffff' : '#c9d1d9';
      ctx.font = '600 13px Inter, sans-serif';
      ctx.textAlign = 'center';
      const nm = a.name.length > 24 ? a.name.slice(0, 22) + '…' : a.name;
      ctx.fillText(nm, cx, box.y + box.h - 6);
      ctx.fillStyle = hexA(sc, 0.9);
      ctx.font = '600 9px monospace';
      ctx.fillText(STATUS_META[status].label.toUpperCase(), cx, box.y + 22);
      ctx.textAlign = 'left';
    };

    const drawParticles = () => {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.y += p.vy; p.life -= 0.012;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.fillStyle = hexA(p.c, p.life * 0.8);
        ctx.fillRect(p.x, p.y, 3, 3);
      }
    };

    const frame = (t: number) => {
      drawFloor();
      const boxes = boxesRef.current;
      for (let i = 0; i < automations.length; i++) {
        const b = boxes[i];
        if (b) drawAgent(automations[i], b, t);
      }
      if (!reduce) drawParticles();
      if (!reduce) raf = requestAnimationFrame(frame);
    };

    layout();
    frame(0);
    if (reduce) frame(0); // un cuadro estatico

    const ro = new ResizeObserver(() => { layout(); if (reduce) frame(performance.now()); });
    ro.observe(wrap);

    // Interaccion
    const pick = (e: MouseEvent): string | null => {
      const r = canvas.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      const hit = boxesRef.current.find(
        (b) => mx >= b.x + 10 && mx <= b.x + b.w - 10 && my >= b.y && my <= b.y + b.h,
      );
      return hit?.id ?? null;
    };
    const onMove = (e: MouseEvent) => {
      const id = pick(e);
      hoverRef.current = id;
      canvas.style.cursor = id ? 'pointer' : 'default';
    };
    const onClick = (e: MouseEvent) => {
      const id = pick(e);
      selectedRef.current = id;
      setSelectedId(id);
    };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('click', onClick);
    };
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

      <div
        ref={wrapRef}
        className="relative w-full overflow-hidden rounded-3xl border border-[#ccff00]/15 bg-[#06080f]"
      >
        <canvas ref={canvasRef} className="block w-full" />
        <div className="pointer-events-none absolute top-3 left-4 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          Click en un agente para ver qué hace
        </div>
      </div>

      {/* Panel de detalle del agente */}
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
                  <p className="text-sm text-zinc-300 bg-black/40 border border-white/5 rounded-2xl p-4 leading-relaxed">
                    {selected.master_prompt}
                  </p>
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
          están verdes trabajan ahora mismo; haz clic en cualquiera para ver qué hace.
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
  const m = STATUS_META[status] ?? STATUS_META.activo;
  const Icon = m.Icon;
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

// Convierte un color (#hex o hsl) a rgba con alfa, usando el propio canvas.
function hexA(color: string, alpha: number): string {
  if (color.startsWith('#')) {
    const n = parseInt(color.slice(1), 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }
  return color.replace(')', `, ${alpha})`).replace('hsl', 'hsla');
}
