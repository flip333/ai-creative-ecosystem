'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Cpu, Activity, CheckCircle2, AlertTriangle, PauseCircle } from 'lucide-react';
import { formatRelative } from '@/lib/format';
import type { AutomationWithLogs, FlowStatus } from '@/lib/types';

// ============================================================
// Mi Oficina IA (v2) — una oficina viva en <canvas>, sin assets externos.
// Cada automatizacion del cliente es un agente pixel: trabaja en su escritorio,
// y si esta activo de vez en cuando se levanta y camina al lounge. El estado del
// flujo manda todo (trabajando / en pausa / en error). Click = panel de detalle.
// ============================================================

const PX = 5;              // tamano del "pixel"
const TOP_WALL = 96;       // pared del fondo
const DESK_ROW_H = 168;    // alto por fila de escritorios
const LOUNGE_H = 64;       // zona de descanso al fondo

type Box = { id: string; x: number; y: number; w: number; h: number };

const STATUS_COLOR: Record<FlowStatus, string> = {
  activo: '#ccff00', pausa: '#eab308', error: '#ff5964',
};
const STATUS_META: Record<FlowStatus, { label: string; badge: string; Icon: typeof CheckCircle2 }> = {
  activo: { label: 'Trabajando', badge: 'bg-green-500/10 text-green-300 border-green-500/30', Icon: CheckCircle2 },
  pausa: { label: 'En pausa', badge: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30', Icon: PauseCircle },
  error: { label: 'En error', badge: 'bg-red-500/10 text-red-300 border-red-500/30', Icon: AlertTriangle },
};
const AREA_LABEL: Record<string, string> = {
  marketing: 'Marketing', ventas: 'Ventas', operaciones: 'Operaciones', soporte: 'Soporte',
};
// La camiseta identifica el AREA; el estado se ve en el aura y el monitor.
const AREA_COLOR: Record<string, string> = {
  ventas: '#1ea7a0', marketing: '#9fbe1f', operaciones: '#4f79c9', soporte: '#8a63c9',
};
function areaColor(area: string | null): string {
  return (area && AREA_COLOR[area]) || '#5b6677';
}
function hairColor(seed: string): string {
  const palette = ['#2a2f3a', '#4a3524', '#6b4a2a', '#1b1b1b', '#5a3a4a'];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h + seed.charCodeAt(i)) % palette.length;
  return palette[h];
}

// Estado en runtime de cada agente (posicion, caminar, parpadeo, burbuja)
type Agent = {
  id: string;
  homeX: number; homeY: number;   // escritorio
  x: number; y: number;           // posicion actual
  phase: 'desk' | 'out' | 'lounge' | 'back';
  until: number;
  tx: number; ty: number;         // destino al caminar
  facing: 1 | -1;
  blinkUntil: number; nextBlink: number;
  appear: number;                 // 0..1 para la entrada
  bubbleUntil: number; bubble: string | null; nextBubble: number;
};

export function ClientOffice({ automations }: { automations: AutomationWithLogs[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxesRef = useRef<Box[]>([]);
  const hoverRef = useRef<string | null>(null);
  const selectedRef = useRef<string | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1, y: -1 });
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
    let width = 0, height = 0, cols = 1, rows = 1;
    let loungeX = 0, loungeY = 0;
    let last = performance.now();
    const agents = new Map<string, Agent>();
    const particles: { x: number; y: number; vy: number; life: number; c: string }[] = [];
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    const rect = (x: number, y: number, w: number, h: number, c: string) => {
      ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), Math.ceil(w), Math.ceil(h));
    };

    const layout = () => {
      width = wrap.clientWidth;
      cols = Math.max(1, Math.min(4, Math.floor(width / 260)));
      rows = Math.max(1, Math.ceil(automations.length / cols));
      const cellW = width / cols;
      height = TOP_WALL + rows * DESK_ROW_H + LOUNGE_H;
      loungeX = width * 0.5;
      loungeY = height - LOUNGE_H + 26;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      automations.forEach((a, i) => {
        const hx = (i % cols) * cellW + cellW / 2;
        const hy = TOP_WALL + Math.floor(i / cols) * DESK_ROW_H + 86;
        const ex = agents.get(a.id);
        if (ex) { ex.homeX = hx; ex.homeY = hy; if (ex.phase === 'desk') { ex.x = hx; ex.y = hy; } }
        else {
          agents.set(a.id, {
            id: a.id, homeX: hx, homeY: hy, x: hx, y: hy,
            phase: 'desk', until: 0, tx: hx, ty: hy, facing: 1,
            blinkUntil: 0, nextBlink: performance.now() + rnd(1500, 5000),
            appear: reduce ? 1 : 0,
            bubbleUntil: 0, bubble: null, nextBubble: performance.now() + rnd(2000, 8000),
          });
        }
      });
      for (const id of agents.keys()) if (!automations.find((a) => a.id === id)) agents.delete(id);
    };

    // ---------- ENTORNO ----------
    const drawEnvironment = (t: number) => {
      // Piso
      const g = ctx.createLinearGradient(0, TOP_WALL, 0, height);
      g.addColorStop(0, '#080b13'); g.addColorStop(1, '#05070c');
      ctx.fillStyle = g; ctx.fillRect(0, TOP_WALL, width, height - TOP_WALL);
      ctx.strokeStyle = 'rgba(204,255,0,0.04)'; ctx.lineWidth = 1;
      for (let x = 0; x <= width; x += 44) { ctx.beginPath(); ctx.moveTo(x, TOP_WALL); ctx.lineTo(x, height); ctx.stroke(); }
      for (let y = TOP_WALL; y <= height; y += 44) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }

      // Pared del fondo
      rect(0, 0, width, TOP_WALL, '#0b0f17');
      rect(0, TOP_WALL - 3, width, 3, '#11161f');
      // Ventanal con skyline neon
      const winX = 28, winY = 18, winW = Math.min(360, width - 320), winH = 56;
      if (winW > 120) {
        rect(winX, winY, winW, winH, '#05080f');
        for (let i = 0; i < 14; i++) {
          const bx = winX + 6 + i * (winW / 14);
          const bh = 10 + ((i * 37) % 36);
          rect(bx, winY + winH - bh, winW / 14 - 3, bh, i % 3 === 0 ? 'rgba(0,255,204,0.35)' : 'rgba(204,255,0,0.22)');
        }
        rect(winX, winY, winW, winH, 'rgba(0,0,0,0)');
        ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.strokeRect(winX, winY, winW, winH);
      }
      // Reloj
      const clkX = width - 48, clkY = 42;
      ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(clkX, clkY, 16, 0, Math.PI * 2); ctx.stroke();
      const ang = (t / 2000) % (Math.PI * 2);
      ctx.strokeStyle = '#ccff00'; ctx.beginPath(); ctx.moveTo(clkX, clkY);
      ctx.lineTo(clkX + Math.cos(ang) * 10, clkY + Math.sin(ang) * 10); ctx.stroke();
      // Tablero de estado
      const activos = automations.filter((a) => a.status === 'activo').length;
      rect(width - 210, 16, 150, 30, '#05080f');
      ctx.strokeStyle = 'rgba(204,255,0,0.2)'; ctx.strokeRect(width - 210, 16, 150, 30);
      ctx.fillStyle = '#8b949e'; ctx.font = '600 8px monospace';
      ctx.fillText('AGENTES ACTIVOS', width - 202, 28);
      ctx.fillStyle = '#ccff00'; ctx.font = '700 14px Outfit, sans-serif';
      ctx.fillText(`${activos}/${automations.length}`, width - 202, 42);

      // Lounge (alfombra + planta + cafetera)
      ctx.fillStyle = 'rgba(0,255,204,0.05)';
      ctx.beginPath(); ctx.ellipse(loungeX, loungeY + 6, 110, 26, 0, 0, Math.PI * 2); ctx.fill();
      // planta
      rect(loungeX - 150, loungeY - 26, 12, 14, '#2a1f14');
      ctx.fillStyle = '#1ea7a0';
      for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.ellipse(loungeX - 144 + (i - 2) * 5, loungeY - 30, 3, 10, (i - 2) * 0.3, 0, Math.PI * 2); ctx.fill(); }
      // cafetera
      rect(loungeX + 128, loungeY - 20, 16, 18, '#11161f');
      rect(loungeX + 131, loungeY - 16, 10, 5, 'rgba(204,255,0,0.5)');
    };

    // ---------- ESCRITORIO ----------
    const drawDesk = (a: AutomationWithLogs, cx: number, baseY: number, t: number, empty: boolean) => {
      const status = (a.status as FlowStatus) ?? 'activo';
      const sc = STATUS_COLOR[status];
      const deskY = baseY + 26;
      // sombra
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath(); ctx.ellipse(cx, deskY + 34, 74, 9, 0, 0, Math.PI * 2); ctx.fill();
      // tablero + patas
      rect(cx - 72, deskY, 144, 7, '#141a24');
      rect(cx - 72, deskY + 7, 144, 14, '#0b0e14');
      rect(cx - 66, deskY + 21, 5, 13, '#0b0e14');
      rect(cx + 61, deskY + 21, 5, 13, '#0b0e14');
      // monitor (brilla segun estado)
      const monX = cx + 20, monY = deskY - 38;
      ctx.save();
      ctx.shadowColor = sc;
      ctx.shadowBlur = status === 'activo' ? 16 : status === 'error' ? (Math.floor(t / 300) % 2 ? 18 : 4) : 6;
      rect(monX, monY, 11 * PX, 8 * PX, '#05070c');
      ctx.restore();
      const scr = status === 'error' && Math.floor(t / 300) % 2 ? 'rgba(255,89,100,0.25)' : hexA(sc, 0.16);
      rect(monX + PX, monY + PX, 9 * PX, 6 * PX, scr);
      ctx.fillStyle = hexA(sc, 0.85);
      for (let i = 0; i < 4; i++) {
        const lw = status === 'activo' ? (2 + ((Math.floor(t / 180) + i) % 5)) * PX : (2 + i) * PX;
        ctx.fillRect(monX + 1.6 * PX, monY + (1.8 + i * 1.3) * PX, Math.min(lw, 8 * PX), 0.7 * PX);
      }
      rect(monX + 4.5 * PX, monY + 8 * PX, 2 * PX, 1.4 * PX, '#05070c');
      // silla vacia cuando el agente no esta
      if (empty) { rect(cx - 34, deskY - 20, 20, 22, '#10151d'); rect(cx - 34, deskY - 24, 20, 5, '#161c26'); }
    };

    // ---------- PERSONAJE ----------
    const drawChar = (a: AutomationWithLogs, ag: Agent, seated: boolean, t: number) => {
      const status = (a.status as FlowStatus) ?? 'activo';
      const sc = STATUS_COLOR[status];
      const cx = ag.x;
      const footY = ag.y + 30;
      const shirt = areaColor(a.area);
      const hair = hairColor(a.name);
      const alpha = ag.appear;
      ctx.globalAlpha = alpha;

      // aura de estado bajo los pies
      ctx.save();
      ctx.shadowColor = sc; ctx.shadowBlur = 14;
      ctx.fillStyle = hexA(sc, status === 'pausa' ? 0.25 : 0.4);
      ctx.beginPath(); ctx.ellipse(cx, footY + 2, 20, 6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      const walking = ag.phase === 'out' || ag.phase === 'back';
      const bob = status === 'activo' && !seated ? Math.sin(t / 180) * 1.5 : seated && status === 'activo' ? Math.sin(t / 220) * 1.5 : 0;
      const topY = (seated ? ag.y - 30 : ag.y - 34) + bob;

      // piernas (solo de pie)
      if (!seated) {
        const sw = walking ? Math.sin(t / 90) * 4 : 0;
        rect(cx - 4 * PX, footY - 5 * PX, 3 * PX, 5 * PX, '#20252e');
        rect(cx + 1 * PX, footY - 5 * PX, 3 * PX, 5 * PX, '#20252e');
        rect(cx - 4 * PX + sw, footY - 1 * PX, 3 * PX, 2 * PX, '#11151d');
        rect(cx + 1 * PX - sw, footY - 1 * PX, 3 * PX, 2 * PX, '#11151d');
      }
      // torso
      rect(cx - 5 * PX, topY + 7 * PX, 10 * PX, 6 * PX, shirt);
      rect(cx - 5 * PX, topY + 7 * PX, 10 * PX, 1 * PX, 'rgba(255,255,255,0.12)');
      // acento de area en el pecho
      rect(cx - 1 * PX, topY + 8.5 * PX, 2 * PX, 2 * PX, hexA(sc, 0.9));
      // cuello + cabeza
      rect(cx - 2 * PX, topY + 6 * PX, 4 * PX, 1.4 * PX, '#e8b48c');
      rect(cx - 4 * PX, topY + 1 * PX, 8 * PX, 6 * PX, '#f1c9a5');
      rect(cx - 4 * PX, topY, 8 * PX, 2 * PX, hair);
      rect(cx - 4 * PX, topY + 1 * PX, 1.2 * PX, 3 * PX, hair);
      rect(cx + 2.8 * PX, topY + 1 * PX, 1.2 * PX, 3 * PX, hair);
      // ojos (parpadeo / dormido)
      const blinking = t < ag.blinkUntil;
      if (status === 'pausa' || blinking) {
        rect(cx - 2.6 * PX, topY + 3.6 * PX, 1.4 * PX, 0.6 * PX, '#3a2f2f');
        rect(cx + 1.2 * PX, topY + 3.6 * PX, 1.4 * PX, 0.6 * PX, '#3a2f2f');
      } else {
        const look = ag.facing > 0 ? 0.3 : -0.3;
        rect(cx - 2.4 * PX + look * PX, topY + 3.2 * PX, 1.2 * PX, 1.2 * PX, '#1b1f2a');
        rect(cx + 1.2 * PX + look * PX, topY + 3.2 * PX, 1.2 * PX, 1.2 * PX, '#1b1f2a');
      }
      // brazos
      if (seated) {
        const typing = status === 'activo' && Math.floor(t / 150) % 2 === 0 ? -2 : 0;
        rect(cx - 6 * PX, topY + 11 * PX + (typing ? 0 : 1), 2 * PX, 3 * PX, shirt);
        rect(cx + 4 * PX, topY + 11 * PX + (typing ? 1 : 0), 2 * PX, 3 * PX, shirt);
      } else {
        const sw = walking ? Math.sin(t / 90) * 3 : 0;
        rect(cx - 6 * PX, topY + 8 * PX + sw, 2 * PX, 4 * PX, shirt);
        rect(cx + 4 * PX, topY + 8 * PX - sw, 2 * PX, 4 * PX, shirt);
      }

      // zzz en pausa
      if (status === 'pausa') {
        ctx.fillStyle = 'rgba(234,179,8,0.9)';
        ctx.font = 'bold 13px monospace'; ctx.fillText('z', cx + 5 * PX, topY - 2 + Math.sin(t / 300) * 2);
        ctx.font = 'bold 9px monospace'; ctx.fillText('z', cx + 6.5 * PX, topY - 8 + Math.sin(t / 300) * 2);
      }
      ctx.globalAlpha = 1;
    };

    // Burbuja de evento (ultima ejecucion) o alerta
    const drawBubble = (ag: Agent, text: string, color: string) => {
      ctx.save();
      ctx.font = '600 11px Inter, sans-serif';
      const w = Math.min(ctx.measureText(text).width + 18, 220);
      const bx = Math.max(6, Math.min(width - w - 6, ag.x - w / 2));
      const by = ag.y - 76;
      ctx.fillStyle = 'rgba(13,17,23,0.96)';
      roundRect(ctx, bx, by, w, 26, 8); ctx.fill();
      ctx.strokeStyle = hexA(color, 0.5); ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = color; ctx.fillRect(ag.x - 3, by + 25, 6, 5);
      ctx.fillStyle = '#e6edf3';
      ctx.fillText(clip(ctx, text, w - 16), bx + 9, by + 17);
      ctx.restore();
    };

    const drawTooltip = (a: AutomationWithLogs, ag: Agent) => {
      const status = (a.status as FlowStatus) ?? 'activo';
      const label = `${a.name}  ·  ${STATUS_META[status].label}`;
      ctx.save();
      ctx.font = '600 11px Inter, sans-serif';
      const w = ctx.measureText(label).width + 20;
      const bx = Math.max(6, Math.min(width - w - 6, ag.x - w / 2));
      const by = ag.y - 58;
      ctx.fillStyle = 'rgba(2,4,10,0.95)';
      roundRect(ctx, bx, by, w, 24, 7); ctx.fill();
      ctx.strokeStyle = hexA(STATUS_COLOR[status], 0.6); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.fillText(label, bx + 10, by + 16);
      ctx.restore();
    };

    const step = (t: number, dt: number) => {
      for (const a of automations) {
        const ag = agents.get(a.id); if (!ag) continue;
        if (ag.appear < 1) ag.appear = Math.min(1, ag.appear + dt / 600);
        if (t > ag.nextBlink) { ag.blinkUntil = t + 120; ag.nextBlink = t + rnd(1800, 5200); }

        const status = (a.status as FlowStatus) ?? 'activo';
        const speed = 0.075 * dt; // px/ms aprox

        // burbuja de evento con la ultima ejecucion
        if (t > ag.nextBubble && ag.phase !== 'out' && ag.phase !== 'back') {
          const log = a.automation_logs[0];
          if (status === 'error') { ag.bubble = '¡Revisión necesaria!'; ag.bubbleUntil = t + 3500; }
          else if (log) { ag.bubble = log.message ?? (log.status === 'success' ? 'Ejecución correcta' : 'Error'); ag.bubbleUntil = t + 3500; }
          ag.nextBubble = t + rnd(6000, 13000);
        }

        if (reduce || status !== 'activo') {
          // sin movimiento: al escritorio
          ag.phase = 'desk'; ag.x = ag.homeX; ag.y = ag.homeY;
          continue;
        }
        // FSM de deambular (solo activos)
        if (ag.phase === 'desk') {
          if (ag.until === 0) ag.until = t + rnd(9000, 22000);
          if (t > ag.until) { ag.phase = 'out'; ag.tx = loungeX + rnd(-90, 90); ag.ty = loungeY + rnd(-8, 8); ag.until = 0; }
        } else if (ag.phase === 'out' || ag.phase === 'back') {
          const tgtX = ag.phase === 'out' ? ag.tx : ag.homeX;
          const tgtY = ag.phase === 'out' ? ag.ty : ag.homeY;
          const dx = tgtX - ag.x, dy = tgtY - ag.y;
          const d = Math.hypot(dx, dy);
          ag.facing = dx >= 0 ? 1 : -1;
          if (d < 2) {
            if (ag.phase === 'out') { ag.phase = 'lounge'; ag.until = t + rnd(3500, 7000); }
            else { ag.phase = 'desk'; ag.x = ag.homeX; ag.y = ag.homeY; ag.until = t + rnd(9000, 22000); }
          } else {
            ag.x += (dx / d) * Math.min(speed, d);
            ag.y += (dy / d) * Math.min(speed, d);
          }
        } else if (ag.phase === 'lounge') {
          if (t > ag.until) { ag.phase = 'back'; }
        }
      }
    };

    const frame = (now: number) => {
      const dt = Math.min(48, now - last); last = now;
      try {
        if (!reduce) step(now, dt);
        drawEnvironment(now);

        // desks (los que no estan sentados se dibujan vacios)
        const boxes: Box[] = [];
        for (const a of automations) {
          const ag = agents.get(a.id); if (!ag) continue;
          const seated = ag.phase === 'desk';
          drawDesk(a, ag.homeX, ag.homeY, now, !seated);
        }
        // personajes ordenados por y (profundidad)
        const order = [...automations].filter((a) => agents.get(a.id)).sort((p, q) => (agents.get(p.id)!.y) - (agents.get(q.id)!.y));
        for (const a of order) {
          const ag = agents.get(a.id)!;
          const seated = ag.phase === 'desk';
          drawChar(a, ag, seated, now);
          // particula de datos desde el monitor si trabaja y esta sentado
          if (!reduce && seated && a.status === 'activo' && Math.random() < 0.025) {
            particles.push({ x: ag.homeX + 20 + 5 * PX, y: ag.homeY - 12, vy: -0.4 - Math.random() * 0.4, life: 1, c: STATUS_COLOR.activo });
          }
          boxes.push({ id: a.id, x: ag.x - 44, y: ag.y - 56, w: 88, h: 96 });
        }
        boxesRef.current = boxes;

        // particulas
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i]; p.y += p.vy * (dt / 16); p.life -= 0.012 * (dt / 16);
          if (p.life <= 0) { particles.splice(i, 1); continue; }
          ctx.fillStyle = hexA(p.c, p.life * 0.8); ctx.fillRect(p.x, p.y, 3, 3);
        }

        // burbujas de evento
        for (const a of automations) {
          const ag = agents.get(a.id); if (!ag || !ag.bubble || now > ag.bubbleUntil) continue;
          drawBubble(ag, ag.bubble, a.status === 'error' ? STATUS_COLOR.error : STATUS_COLOR.activo);
        }

        // tooltip del agente bajo el cursor
        const hid = hoverRef.current;
        if (hid) { const a = automations.find((x) => x.id === hid); const ag = agents.get(hid); if (a && ag) drawTooltip(a, ag); }
      } catch (err) {
        console.error('Oficina render error:', err);
        cancelAnimationFrame(raf);
        return;
      }
      if (!reduce) raf = requestAnimationFrame(frame);
    };

    layout();
    last = performance.now();
    frame(last);

    const ro = new ResizeObserver(() => { layout(); if (reduce) frame(performance.now()); });
    ro.observe(wrap);

    const pick = (e: MouseEvent): string | null => {
      const r = canvas.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      mouseRef.current = { x: mx, y: my };
      // el ultimo en la lista (mas al frente) gana
      for (let i = boxesRef.current.length - 1; i >= 0; i--) {
        const b = boxesRef.current[i];
        if (mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h) return b.id;
      }
      return null;
    };
    const onMove = (e: MouseEvent) => { const id = pick(e); hoverRef.current = id; canvas.style.cursor = id ? 'pointer' : 'default'; };
    const onClick = (e: MouseEvent) => { const id = pick(e); selectedRef.current = id; setSelectedId(id); };
    const onLeave = () => { hoverRef.current = null; mouseRef.current = { x: -1, y: -1 }; };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('click', onClick);
    canvas.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, [automations]);

  if (automations.length === 0) {
    const activos = 0;
    return (
      <div className="flex flex-col gap-6">
        <OfficeIntro total={0} activos={activos} />
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
      <div ref={wrapRef} className="relative w-full overflow-hidden rounded-3xl border border-[#ccff00]/15 bg-[#06080f]">
        <canvas ref={canvasRef} className="block w-full" />
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

// ---------- helpers de canvas ----------
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function clip(ctx: CanvasRenderingContext2D, text: string, maxW: number): string {
  if (ctx.measureText(text).width <= maxW) return text;
  let s = text;
  while (s.length > 1 && ctx.measureText(s + '…').width > maxW) s = s.slice(0, -1);
  return s + '…';
}
function hexA(color: string, alpha: number): string {
  if (color.startsWith('#')) {
    const n = parseInt(color.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
  }
  return color;
}
