'use client';

import { useEffect, useRef, useState } from 'react';
import { Wifi, WifiOff, Loader2, Cpu, X } from 'lucide-react';
import { useSupabaseAgents } from '@/hooks/useSupabaseAgents';
import type { OfficeAgent, OfficeAgentStatus } from '@/lib/types';

// ============================================================
// Oficina 2D (canvas 2D puro, SIN WebGL) — compatible con cualquier equipo.
// Consume office_agents en tiempo real vía useSupabaseAgents y coloca cada
// agente usando position_x / position_z. Color institucional por estado.
// ============================================================

const STATUS_HEX: Record<OfficeAgentStatus, string> = {
  active: '#ccff00', idle: '#00ffcc', error: '#ff5964',
};
const STATUS_LABEL: Record<OfficeAgentStatus, string> = {
  active: 'Trabajando', idle: 'En espera', error: 'En error',
};

type Box = { id: string; x: number; y: number; w: number; h: number };

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
    let width = 0;
    const height = 480;

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
          return { x: (i % cols) * cellW + cellW / 2, y: 150 + Math.floor(i / cols) * 150 };
        }
        return { x: cx + a.position_x * 62, y: 180 + a.position_z * 46 };
      });
    };

    const resize = () => {
      width = wrap.clientWidth || 980;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const rect = (x: number, y: number, w: number, h: number, c: string) => {
      ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), Math.ceil(w), Math.ceil(h));
    };

    const drawFloor = () => {
      ctx.fillStyle = '#06080f';
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(204,255,0,0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= width; x += 44) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
      for (let y = 0; y <= height; y += 44) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
    };

    const drawAgent = (a: OfficeAgent, sx: number, sy: number, t: number) => {
      const sc = STATUS_HEX[a.status] ?? STATUS_HEX.idle;
      const hover = hoverRef.current === a.id || selectedRef.current === a.id;
      const P = 5;
      const bob = a.status === 'active' && !reduce ? Math.sin(t / 200 + sx) * 2 : 0;
      const deskY = sy + 24;

      // glow de estado (radial, 2D — no necesita WebGL)
      const g = ctx.createRadialGradient(sx + 22, deskY - 18, 2, sx + 22, deskY - 18, 60);
      const alpha = a.status === 'error' ? (Math.floor(t / 300) % 2 ? 0.5 : 0.15) : a.status === 'active' ? 0.4 : 0.2;
      g.addColorStop(0, hexA(sc, alpha));
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g; ctx.fillRect(sx - 40, deskY - 70, 130, 110);

      // sombra + aro de estado
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath(); ctx.ellipse(sx, deskY + 34, 60, 8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = hexA(sc, hover ? 0.95 : 0.5); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(sx, deskY + 34, 40, 10, 0, 0, Math.PI * 2); ctx.stroke();

      // personaje (pixel)
      const topY = sy - 34 + bob;
      rect(sx - 5 * P, topY + 7 * P, 10 * P, 6 * P, areaShirt(a.name));
      rect(sx - 2 * P, topY + 6 * P, 4 * P, 1.4 * P, '#e8b48c');
      rect(sx - 4 * P, topY + 1 * P, 8 * P, 6 * P, '#f1c9a5');
      rect(sx - 4 * P, topY, 8 * P, 2 * P, '#2a2f3a');
      rect(sx - 1 * P, topY + 8.5 * P, 2 * P, 2 * P, sc);
      if (a.status === 'idle') {
        rect(sx - 2.6 * P, topY + 3.6 * P, 1.4 * P, 0.6 * P, '#3a2f2f');
        rect(sx + 1.2 * P, topY + 3.6 * P, 1.4 * P, 0.6 * P, '#3a2f2f');
      } else {
        rect(sx - 2.4 * P, topY + 3.2 * P, 1.2 * P, 1.2 * P, '#1b1f2a');
        rect(sx + 1.2 * P, topY + 3.2 * P, 1.2 * P, 1.2 * P, '#1b1f2a');
      }

      // escritorio + monitor
      rect(sx - 46, deskY + 20, 92, 7, '#141a24');
      rect(sx - 46, deskY + 27, 92, 14, '#0b0e14');
      rect(sx + 14, deskY - 18, 11 * P, 8 * P, '#05070c');
      const scr = a.status === 'error' && Math.floor(t / 300) % 2 ? 'rgba(255,89,100,0.3)' : hexA(sc, 0.18);
      rect(sx + 14 + P, deskY - 18 + P, 9 * P, 6 * P, scr);
      ctx.fillStyle = hexA(sc, 0.85);
      for (let i = 0; i < 4; i++) {
        const lw = a.status === 'active' ? (2 + ((Math.floor(t / 180) + i) % 5)) * P : (2 + i) * P;
        ctx.fillRect(sx + 14 + 1.6 * P, deskY - 18 + (1.6 + i * 1.3) * P, Math.min(lw, 8 * P), 0.7 * P);
      }

      // nombre + estado
      ctx.fillStyle = hover ? '#ffffff' : '#c9d1d9';
      ctx.font = '600 13px Inter, sans-serif'; ctx.textAlign = 'center';
      const nm = a.name.length > 22 ? a.name.slice(0, 20) + '…' : a.name;
      ctx.fillText(nm, sx, deskY + 58);
      ctx.fillStyle = hexA(sc, 0.9); ctx.font = '600 9px monospace';
      ctx.fillText((STATUS_LABEL[a.status] ?? a.status).toUpperCase(), sx, deskY + 72);
      ctx.textAlign = 'left';
    };

    const frame = (t: number) => {
      try {
        drawFloor();
        const list = agentsRef.current;
        const pos = screenPos(list);
        const order = list.map((a, i) => ({ a, p: pos[i] })).sort((u, v) => u.p.y - v.p.y);
        const boxes: Box[] = [];
        for (const { a, p } of order) {
          drawAgent(a, p.x, p.y, t);
          boxes.push({ id: a.id, x: p.x - 46, y: p.y - 54, w: 92, h: 150 });
        }
        boxesRef.current = boxes;
      } catch (e) { console.error('Oficina 2D error:', e); cancelAnimationFrame(raf); return; }
      if (!reduce) raf = requestAnimationFrame(frame);
    };

    resize();
    frame(0);
    const ro = new ResizeObserver(() => { resize(); if (reduce) frame(performance.now()); });
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
    const onMove = (e: MouseEvent) => { const id = pick(e); hoverRef.current = id; canvas.style.cursor = id ? 'pointer' : 'default'; };
    const onClick = (e: MouseEvent) => { const id = pick(e); selectedRef.current = id; setSelectedId(id); };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(raf); ro.disconnect();
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

      <div ref={wrapRef} className="relative w-full overflow-hidden rounded-3xl border border-[#ccff00]/15 bg-[#06080f]">
        <canvas ref={canvasRef} className="block w-full" />
        {connection === 'connected' && agents.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-zinc-400 text-sm max-w-xs text-center px-6">
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

      {selected && (
        <div className="fixed top-0 right-0 bottom-0 w-[360px] max-w-[92vw] bg-[#0d1117] border-l border-[#ccff00]/20 shadow-2xl z-50 flex flex-col">
          <div className="p-6 border-b border-white/5 flex items-start justify-between">
            <div className="min-w-0">
              <span className="font-mono text-[10px] tracking-widest uppercase text-[#ccff00]">Agente</span>
              <h2 className="font-display text-lg font-medium text-white tracking-tight truncate">{selected.name}</h2>
            </div>
            <button onClick={() => setSelectedId(null)} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer shrink-0">
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

function areaShirt(seed: string): string {
  const palette = ['#1ea7a0', '#9fbe1f', '#4f79c9', '#8a63c9', '#c9794f'];
  let h = 0; for (let i = 0; i < seed.length; i++) h = (h + seed.charCodeAt(i)) % palette.length;
  return palette[h];
}
function hexA(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}
