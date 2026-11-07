'use client';

import { useEffect, useRef, useState } from 'react';
import { Wifi, WifiOff, Loader2, Cpu, X } from 'lucide-react';
import { useSupabaseAgents } from '@/hooks/useSupabaseAgents';
import type { OfficeAgent, OfficeAgentStatus } from '@/lib/types';
import {
  PX, WALL_H, STATUS_COLOR, agentLook, hexA, activityText,
  drawRoom, drawPlant, drawCoffee, drawLounge, drawStation, drawBubble,
} from './officePixelSprites';

// ============================================================
// Oficina 2D pixel-art (canvas 2D puro, SIN WebGL) — compatible con cualquier equipo.
// Consume office_agents en tiempo real vía useSupabaseAgents y coloca cada
// agente usando position_x / position_z. Sprites propios en officePixelSprites.ts.
// ============================================================

const STATUS_HEX: Record<OfficeAgentStatus, string> = STATUS_COLOR;
const STATUS_LABEL: Record<OfficeAgentStatus, string> = {
  active: 'Trabajando', idle: 'En espera', error: 'En error',
};
const MIN_H = 480;

type Box = { id: string; x: number; y: number; w: number; h: number };
type WalkState = { mode: 'seat' | 'out' | 'away' | 'back'; dx: number; dir: 1 | -1; until: number };

export function ClientOffice2D() {
  const { agents, connection } = useSupabaseAgents();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxesRef = useRef<Box[]>([]);
  const hoverRef = useRef<string | null>(null);
  const selectedRef = useRef<string | null>(null);
  const agentsRef = useRef<OfficeAgent[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  agentsRef.current = agents;
  const selected = agents.find((a) => a.id === selectedId) ?? null;
  useEffect(() => { selectedRef.current = selectedId; }, [selectedId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce =
      typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

    let raf = 0;
    let timer = 0;
    let width = 0;
    let height = MIN_H;
    let lastT = 0;
    const walks = new Map<string, WalkState>();

    // Proyecta position_x / position_z a pantalla. Si todas las posiciones
    // coinciden (p.ej. todo en 0), reparte en grilla para que no se solapen.
    const screenPos = (list: OfficeAgent[]) => {
      const xs = list.map((a) => a.position_x);
      const zs = list.map((a) => a.position_z);
      const spread = (arr: number[]) => (arr.length ? Math.max(...arr) - Math.min(...arr) : 0);
      const flat = spread(xs) < 0.01 && spread(zs) < 0.01;
      const cx = width / 2;
      return list.map((a, i) => {
        if (flat) {
          const cols = Math.max(1, Math.min(4, Math.floor(width / 240)));
          const cellW = width / cols;
          return { x: (i % cols) * cellW + cellW / 2, y: 160 + Math.floor(i / cols) * 160 };
        }
        return { x: cx + a.position_x * 62, y: Math.max(160, 180 + a.position_z * 46) };
      });
    };

    const applySize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const resize = () => {
      width = wrap.clientWidth || 980;
      applySize();
    };

    // FSM simple: los agentes 'active' se levantan, caminan al costado y vuelven.
    const updateWalk = (a: OfficeAgent, sx: number, t: number, dt: number): WalkState => {
      let w = walks.get(a.id);
      if (!w) { w = { mode: 'seat', dx: 0, dir: 1, until: t + 4000 + Math.random() * 8000 }; walks.set(a.id, w); }
      if (reduce || a.status !== 'active') {
        w.mode = 'seat'; w.dx = 0; w.until = t + 4000 + Math.random() * 8000;
        return w;
      }
      const speed = 46; // px/s
      if (w.mode === 'seat' && t >= w.until) {
        w.dir = sx + 90 > width ? -1 : sx - 90 < 0 ? 1 : Math.random() < 0.5 ? -1 : 1;
        w.mode = 'out';
      } else if (w.mode === 'out') {
        w.dx += w.dir * speed * dt;
        if (Math.abs(w.dx) >= 80) { w.dx = w.dir * 80; w.mode = 'away'; w.until = t + 2500; }
      } else if (w.mode === 'away' && t >= w.until) {
        w.mode = 'back';
      } else if (w.mode === 'back') {
        w.dx -= w.dir * speed * dt;
        if (w.dx * w.dir <= 0) { w.dx = 0; w.mode = 'seat'; w.until = t + 6000 + Math.random() * 9000; }
      }
      return w;
    };

    const draw = (t: number): boolean => {
      try {
        const dt = Math.min(0.1, Math.max(0, (t - lastT) / 1000));
        lastT = t;
        const list = agentsRef.current;
        const pos = screenPos(list);

        // Alto dinámico: filas de agentes + franja de lounge
        const maxY = pos.reduce((m, p) => Math.max(m, p.y), 0);
        const needH = Math.max(MIN_H, maxY + 130 + 120);
        if (needH !== height) { height = needH; applySize(); }

        drawRoom(ctx, width, height, t, reduce);
        // Mobiliario
        drawPlant(ctx, 36, WALL_H - 8, t, reduce);
        drawPlant(ctx, width - 36, WALL_H - 8, t, reduce);
        drawCoffee(ctx, width - 110, WALL_H - 34, t, reduce);
        const loungeW = Math.min(300, width - 120);
        if (loungeW > 150) drawLounge(ctx, 20, height - 108, loungeW, 92);
        drawPlant(ctx, width - 40, height - 40, t, reduce);

        const order = list.map((a, i) => ({ a, p: pos[i] })).sort((u, v) => u.p.y - v.p.y);
        const boxes: Box[] = [];
        for (const { a, p } of order) {
          const look = agentLook(a.name);
          const hover = hoverRef.current === a.id || selectedRef.current === a.id;
          const w = updateWalk(a, p.x, t, dt);
          const walking = w.mode !== 'seat';
          drawStation(ctx, {
            sx: p.x, sy: p.y, status: a.status, look, t, reduce, hover,
            walk: walking ? { dx: w.dx, moving: w.mode === 'out' || w.mode === 'back' } : null,
          });

          // Burbuja: zzz / ! siempre; actividad al pasar el mouse o seleccionar
          const bx = p.x, by = p.y - 6 * PX;
          if (a.status === 'error') {
            if (reduce || Math.floor(t / 400) % 2 === 0) {
              drawBubble(ctx, bx, by, '!', '#ff5964', { font: '800 14px Outfit, Inter, sans-serif' });
            }
          } else if (a.status === 'idle') {
            const f = reduce ? 2 : Math.floor(t / 500) % 3;
            drawBubble(ctx, bx, by - (reduce ? 0 : f * 2), 'z'.repeat(f + 1), '#00ffcc', { font: '700 12px monospace' });
          } else if (hover) {
            drawBubble(ctx, bx, by, activityText(a.name, t), '#ccff00');
          }

          // Nombre + estado
          const sc = STATUS_HEX[a.status] ?? STATUS_HEX.idle;
          ctx.textAlign = 'center';
          ctx.fillStyle = hover ? '#ffffff' : '#c9d1d9';
          ctx.font = '600 13px Inter, sans-serif';
          const nm = a.name.length > 22 ? a.name.slice(0, 20) + '…' : a.name;
          ctx.fillText(nm, p.x, p.y + 21 * PX + 18);
          ctx.fillStyle = hexA(sc, 0.9);
          ctx.font = '600 9px monospace';
          ctx.fillText((STATUS_LABEL[a.status] ?? a.status).toUpperCase(), p.x, p.y + 21 * PX + 32);
          ctx.textAlign = 'left';

          boxes.push({ id: a.id, x: p.x - 62, y: p.y - 30, w: 124, h: 21 * PX + 62 });
        }
        boxesRef.current = boxes;
        return true;
      } catch (e) {
        console.error('Oficina 2D error:', e);
        return false;
      }
    };

    const frame = (t: number) => {
      if (!draw(t)) return;
      raf = requestAnimationFrame(frame);
    };

    resize();
    if (reduce) {
      // Sin animación: redibuja de forma espaciada para reflejar cambios en vivo.
      draw(0);
      timer = window.setInterval(() => { if (!draw(0)) window.clearInterval(timer); }, 1000);
    } else {
      raf = requestAnimationFrame(frame);
    }
    const ro = new ResizeObserver(() => { resize(); if (reduce) draw(0); });
    ro.observe(wrap);

    const pick = (e: MouseEvent): string | null => {
      const r = canvas.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      for (let i = boxesRef.current.length - 1; i >= 0; i--) {
        const b = boxesRef.current[i];
        if (mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h) return b.id;
      }
      return null;
    };
    const onMove = (e: MouseEvent) => {
      const id = pick(e); hoverRef.current = id; canvas.style.cursor = id ? 'pointer' : 'default';
      if (reduce) draw(0);
    };
    const onClick = (e: MouseEvent) => {
      const id = pick(e); selectedRef.current = id; setSelectedId(id);
      if (reduce) draw(0);
    };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(raf); window.clearInterval(timer); ro.disconnect();
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <section className="bg-gradient-to-br from-[#0d1117] to-black border border-[#ccff00]/15 rounded-3xl p-6 flex items-center justify-between gap-6 flex-wrap">
        <div>
          <div className="font-mono text-[10px] tracking-widest uppercase text-[#ccff00] mb-2 flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5" /> Tu equipo de agentes · tiempo real
          </div>
          <p className="text-sm text-zinc-400 max-w-xl">
            Cada agente de tu oficina, en vivo desde Supabase. Haz clic en cualquiera para ver su estado.
          </p>
        </div>
        <ConnBadge connection={connection} count={agents.length} />
      </section>

      <div ref={wrapRef} className="relative w-full overflow-hidden rounded-3xl border border-[#ccff00]/15 bg-[#02040a]">
        <canvas
          ref={canvasRef}
          className="block w-full"
          role="img"
          aria-label="Oficina pixel-art con tus agentes de IA en tiempo real"
        />
        {connection === 'connected' && agents.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-zinc-300 text-sm max-w-xs text-center px-6 py-4 rounded-2xl bg-[#02040a]/80 border border-white/10">
              Tu oficina está lista pero aún no tiene agentes. Cuando se creen en{' '}
              <span className="font-mono text-[#00ffcc]">office_agents</span>, aparecerán aquí en vivo.
            </p>
          </div>
        )}
        {connection === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Loader2 className="w-6 h-6 text-[#ccff00] animate-spin" />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-1 font-mono text-[10px] uppercase tracking-widest text-[#8b949e]">
        {(Object.keys(STATUS_LABEL) as OfficeAgentStatus[]).map((s) => (
          <span key={s} className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm" style={{ background: STATUS_HEX[s] }} /> {STATUS_LABEL[s]}
          </span>
        ))}
      </div>

      {selected && (
        <div className="fixed top-0 right-0 bottom-0 w-[360px] max-w-[92vw] bg-[#0d1117] border-l border-[#ccff00]/20 shadow-2xl z-50 flex flex-col">
          <div className="p-6 border-b border-white/5 flex items-start justify-between">
            <div className="min-w-0">
              <span className="font-mono text-[10px] tracking-widest uppercase text-[#ccff00]">Agente</span>
              <h2 className="font-display text-lg font-medium text-white tracking-tight truncate">{selected.name}</h2>
            </div>
            <button
              onClick={() => setSelectedId(null)}
              aria-label="Cerrar panel"
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: STATUS_HEX[selected.status] }} />
              <span className="text-sm text-zinc-200">{STATUS_LABEL[selected.status] ?? selected.status}</span>
            </div>
            <div className="bg-black/40 border border-white/5 rounded-xl p-3 font-mono text-[11px] text-zinc-400">
              posición [{selected.position_x}, {selected.position_y}, {selected.position_z}]
            </div>
            <div className="font-mono text-[10px] text-zinc-600">
              actualizado {new Date(selected.updated_at).toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ConnBadge({ connection, count }: { connection: 'loading' | 'connected' | 'error'; count: number }) {
  if (connection === 'connected')
    return (
      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00] text-xs font-semibold">
        <Wifi className="w-3.5 h-3.5" /> En vivo · {count} agentes
      </div>
    );
  if (connection === 'error')
    return (
      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold">
        <WifiOff className="w-3.5 h-3.5" /> Sin conexión en vivo
      </div>
    );
  return (
    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-xs font-semibold">
      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Conectando…
    </div>
  );
}
