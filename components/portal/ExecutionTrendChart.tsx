'use client';

import { useId, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import type { ExecutionTrendPoint } from '@/lib/types';

const W = 640;
const H = 170;
const PAD = { top: 16, right: 14, bottom: 26, left: 14 };
const LIME = '#ccff00';
const ERR = '#ff6b6b';

function dayLabel(day: string, long = false): string {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    ...(long ? { weekday: 'long' } : {}),
  });
}

export default function ExecutionTrendChart({ data }: { data: ExecutionTrendPoint[] }) {
  const uid = useId().replace(/:/g, '');
  const [active, setActive] = useState<number | null>(null);

  const n = data.length;
  const max = Math.max(1, ...data.map((p) => Math.max(p.success, p.error)));
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (n <= 1 ? 0 : (i / (n - 1)) * innerW);
  const y = (v: number) => PAD.top + innerH - (v / max) * innerH;
  const baseY = PAD.top + innerH;

  const line = (key: 'success' | 'error') =>
    data.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`).join(' ');
  const area = `${line('success')} L${x(n - 1).toFixed(1)},${baseY} L${x(0).toFixed(1)},${baseY} Z`;

  const totalSuccess = data.reduce((a, p) => a + p.success, 0);
  const totalError = data.reduce((a, p) => a + p.error, 0);
  const last = data[n - 1];
  const hasErrors = totalError > 0;

  const idxFromPointer = (e: PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    return Math.min(n - 1, Math.max(0, Math.round(((px - PAD.left) / innerW) * (n - 1))));
  };

  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setActive((a) => Math.max(0, (a ?? n) - 1));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setActive((a) => Math.min(n - 1, (a ?? -1) + 1));
    } else if (e.key === 'Escape') setActive(null);
  };

  const focus = active !== null ? data[active] : null;
  const tipLeft = active !== null ? (x(active) / W) * 100 : 0;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto touch-pan-y focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ccff00] rounded-lg"
        role="img"
        tabIndex={0}
        aria-labelledby={`${uid}-t ${uid}-d`}
        onPointerMove={(e) => setActive(idxFromPointer(e))}
        onPointerLeave={() => setActive(null)}
        onBlur={() => setActive(null)}
        onKeyDown={onKey}
      >
        <title id={`${uid}-t`}>Ejecuciones por día, últimos {n} días</title>
        <desc id={`${uid}-d`}>
          {totalSuccess} ejecuciones exitosas y {totalError} con error en {n} días. Hoy:{' '}
          {last.success} exitosas, {last.error} con error. Usa las flechas para recorrer los días.
        </desc>
        <defs>
          <linearGradient id={`${uid}-g`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={LIME} stopOpacity="0.28" />
            <stop offset="100%" stopColor={LIME} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Líneas guía recesivas */}
        {[0, 0.5, 1].map((t) => (
          <line
            key={t}
            x1={PAD.left}
            x2={W - PAD.right}
            y1={PAD.top + innerH * t}
            y2={PAD.top + innerH * t}
            stroke="#ffffff"
            strokeOpacity={t === 1 ? 0.14 : 0.05}
          />
        ))}

        <path d={area} fill={`url(#${uid}-g)`} />
        <path d={line('success')} fill="none" stroke={LIME} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {hasErrors && (
          <path d={line('error')} fill="none" stroke={ERR} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        )}
        {data.map(
          (p, i) =>
            p.error > 0 && (
              <circle key={p.day} cx={x(i)} cy={y(p.error)} r="3.5" fill={ERR} stroke="#02040a" strokeWidth="2" />
            ),
        )}

        {/* Endpoint enfatizado */}
        <circle cx={x(n - 1)} cy={y(last.success)} r="9" fill={LIME} fillOpacity="0.18" />
        <circle cx={x(n - 1)} cy={y(last.success)} r="4.5" fill={LIME} stroke="#02040a" strokeWidth="2" />

        {/* Eje X: primer y último día */}
        <text x={PAD.left} y={H - 6} fontSize="11" fill="#a1a1aa" textAnchor="start">
          {dayLabel(data[0].day)}
        </text>
        <text x={W - PAD.right} y={H - 6} fontSize="11" fill="#a1a1aa" textAnchor="end">
          Hoy
        </text>

        {focus && active !== null && (
          <>
            <line x1={x(active)} x2={x(active)} y1={PAD.top} y2={baseY} stroke="#fff" strokeOpacity="0.25" />
            <circle cx={x(active)} cy={y(focus.success)} r="4.5" fill={LIME} stroke="#02040a" strokeWidth="2" />
          </>
        )}
      </svg>

      {focus && (
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-xl border border-white/10 bg-[#0d1117]/95 px-3 py-2 text-xs shadow-lg backdrop-blur"
          style={{ left: `clamp(70px, ${tipLeft}%, calc(100% - 70px))` }}
          aria-hidden="true"
        >
          <div className="font-semibold text-white capitalize">{dayLabel(focus.day, true)}</div>
          <div className="text-zinc-300">
            <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ background: LIME }} />
            {focus.success} exitosas
          </div>
          <div className="text-zinc-300">
            <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ background: ERR }} />
            {focus.error} con error
          </div>
        </div>
      )}

      {/* Leyenda (identidad nunca solo por color) */}
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-zinc-400">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-0.5 rounded" style={{ background: LIME }} /> Exitosas ({totalSuccess})
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-0.5 rounded" style={{ background: ERR }} /> Con error ({totalError})
        </span>
      </div>

      {/* Vista de tabla para lectores de pantalla */}
      <table className="sr-only">
        <caption>Ejecuciones por día</caption>
        <thead>
          <tr><th>Día</th><th>Exitosas</th><th>Con error</th></tr>
        </thead>
        <tbody>
          {data.map((p) => (
            <tr key={p.day}><td>{dayLabel(p.day)}</td><td>{p.success}</td><td>{p.error}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
