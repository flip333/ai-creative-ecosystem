/** Helpers de presentación compartidos por portal y admin. */

export function formatMoney(value: number | null | undefined): string {
  return `$${(value ?? 0).toFixed(2)}`;
}

export function formatMonthlyCost(value: number | null | undefined): string {
  return `${formatMoney(value)} / mes`;
}

/** "Hace 30 min", "Hace 2 horas", "14/may/2026". */
export function formatRelative(iso: string | null | undefined): string {
  if (!iso) return '—';

  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '—';

  const minutes = Math.floor((Date.now() - then) / 60000);

  if (minutes < 1) return 'Hace un momento';
  if (minutes < 60) return `Hace ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;

  const days = Math.floor(hours / 24);
  if (days === 1) return 'Ayer';
  if (days < 7) return `Hace ${days} días`;

  return formatDate(iso);
}

/** "14/may/2026" */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** "Hoy 09:42", "Ayer 14:27", "27/jul 07:00" — usado en el log de ejecuciones. */
export function formatLogTime(iso: string | null | undefined): string {
  if (!iso) return '—';

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';

  const time = date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const daysAgo = Math.floor((startOfToday.getTime() - date.getTime()) / 86400000);

  if (daysAgo < 0) return `Hoy ${time}`;
  if (daysAgo < 1) return `Ayer ${time}`;

  const short = date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  return `${short} ${time}`;
}

/** "Camila Arango" → "CA". Fallback cuando el perfil no trae iniciales. */
export function initialsOf(name: string | null | undefined): string {
  if (!name?.trim()) return '??';

  const parts = name.trim().split(/\s+/);
  const raw = parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2);

  return raw.toUpperCase();
}

/**
 * Sparkline por defecto cuando la automatización no tiene puntos guardados.
 * Una línea plana es más honesta que inventar una tendencia.
 */
export const FLAT_SPARKLINE = '0,12 10,12 20,12 30,12 40,12 50,12 60,12';
