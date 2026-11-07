// ============================================================
// Sprites pixel-art propios para "Mi Oficina IA" — dibujados en Canvas 2D
// puro (sin WebGL, sin assets externos). Todo son rectángulos alineados a
// una rejilla de PX pixeles, al estilo pixel-agents.
// ============================================================

export type SpriteStatus = 'active' | 'idle' | 'error';

/** Tamaño de un "pixel de arte" en pixeles de pantalla. */
export const PX = 4;
/** Alto de la pared superior. */
export const WALL_H = 100;
/** Lado de cada baldosa del piso. */
export const TILE = 40;

export const STATUS_COLOR: Record<SpriteStatus, string> = {
  active: '#ccff00',
  idle: '#00ffcc',
  error: '#ff5964',
};

const SHIRTS = ['#1ea7a0', '#9fbe1f', '#4f79c9', '#8a63c9', '#c9794f', '#c94f7a'];
const HAIRS = ['#2a2f3a', '#5a3a22', '#c9a24f', '#8a3b2a', '#d9d9e0', '#1b1f2a'];
const SKINS = ['#f1c9a5', '#e8b48c', '#c98f66', '#8d5a3c', '#f6d5b8'];

export interface AgentLook {
  shirt: string;
  hair: string;
  skin: string;
  style: number; // 0 corto, 1 largo, 2 flequillo
}

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Apariencia determinista a partir del nombre (camiseta, pelo, piel). */
export function agentLook(name: string): AgentLook {
  const h = hashStr(name);
  return {
    shirt: SHIRTS[h % SHIRTS.length],
    hair: HAIRS[(h >>> 3) % HAIRS.length],
    skin: SKINS[(h >>> 6) % SKINS.length],
    style: (h >>> 9) % 3,
  };
}

export function hexA(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

// Rect en unidades de arte relativas a un origen (ox, oy).
function u(
  ctx: CanvasRenderingContext2D, ox: number, oy: number,
  x: number, y: number, w: number, h: number, c: string,
) {
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(ox + x * PX), Math.round(oy + y * PX), Math.ceil(w * PX), Math.ceil(h * PX));
}

// ------------------------------------------------------------
// Sala: pared, zócalo, ventanas, piso con baldosas
// ------------------------------------------------------------
export function drawRoom(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, reduce: boolean) {
  // Pared
  ctx.fillStyle = '#0a0f18';
  ctx.fillRect(0, 0, w, WALL_H);
  ctx.fillStyle = 'rgba(255,255,255,0.025)';
  for (let x = 0; x < w; x += 64) ctx.fillRect(x, 0, 2, WALL_H - 10);
  // Moldura superior
  ctx.fillStyle = '#111826';
  ctx.fillRect(0, 0, w, 8);
  ctx.fillStyle = hexA('#ccff00', 0.25);
  ctx.fillRect(0, 8, w, 2);

  // Ventanas (noche con estrellas)
  if (w > 520) {
    for (const wx of [w * 0.2, w * 0.8]) {
      const x = Math.round(wx - 48), y = 22;
      ctx.fillStyle = '#1b2433'; ctx.fillRect(x - 4, y - 4, 104, 62);
      const g = ctx.createLinearGradient(0, y, 0, y + 54);
      g.addColorStop(0, '#07121f'); g.addColorStop(1, '#12304a');
      ctx.fillStyle = g; ctx.fillRect(x, y, 96, 54);
      for (let i = 0; i < 7; i++) {
        const sx = x + 8 + ((i * 37 + Math.round(wx)) % 80);
        const sy = y + 6 + ((i * 23) % 34);
        const tw = reduce ? 0.8 : 0.4 + 0.5 * Math.abs(Math.sin(t / 700 + i * 1.7));
        ctx.fillStyle = `rgba(255,255,255,${tw})`; ctx.fillRect(sx, sy, 2, 2);
      }
      ctx.fillStyle = '#1b2433'; ctx.fillRect(x + 46, y, 4, 54); ctx.fillRect(x, y + 25, 96, 4);
    }
  }

  // Letrero de marca
  ctx.save();
  ctx.font = '700 14px Outfit, Inter, sans-serif';
  ctx.textAlign = 'center';
  const lw = ctx.measureText('GENFLOW').width + 28;
  const lx = Math.round(w / 2 - lw / 2);
  ctx.fillStyle = '#0d1420'; ctx.fillRect(lx, 30, lw, 28);
  ctx.strokeStyle = hexA('#ccff00', 0.5); ctx.lineWidth = 2; ctx.strokeRect(lx + 1, 31, lw - 2, 26);
  ctx.fillStyle = '#ccff00'; ctx.fillText('GENFLOW', w / 2, 49);
  ctx.restore();

  // Zócalo
  ctx.fillStyle = '#18202e'; ctx.fillRect(0, WALL_H - 10, w, 10);
  ctx.fillStyle = hexA('#00ffcc', 0.25); ctx.fillRect(0, WALL_H - 10, w, 2);
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(0, WALL_H, w, 6);

  // Piso con baldosas
  for (let ty = WALL_H, r = 0; ty < h; ty += TILE, r++) {
    for (let tx = 0, c = 0; tx < w; tx += TILE, c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? '#080b13' : '#0a0e18';
      ctx.fillRect(tx, ty, TILE, TILE);
    }
  }
  ctx.fillStyle = 'rgba(204,255,0,0.045)';
  for (let x = 0; x <= w; x += TILE) ctx.fillRect(x, WALL_H, 1, h - WALL_H);
  for (let y = WALL_H; y <= h; y += TILE) ctx.fillRect(0, y, w, 1);
}

// ------------------------------------------------------------
// Mobiliario
// ------------------------------------------------------------
export function drawPlant(ctx: CanvasRenderingContext2D, x: number, y: number, t: number, reduce: boolean) {
  const sway = reduce ? 0 : Math.sin(t / 900 + x) * 0.5;
  // maceta
  u(ctx, x, y, -3, 4, 6, 1, '#7a4a30');
  u(ctx, x, y, -2.5, 5, 5, 3, '#63391f');
  u(ctx, x, y, -2.5, 7.5, 5, 0.5, '#4a2a16');
  // hojas
  u(ctx, x, y, -0.5 + sway, -4, 1, 8, '#1f7a3d');
  u(ctx, x, y, -3 + sway, -2, 3, 2, '#2fa352');
  u(ctx, x, y, 0.5 + sway, -3, 3, 2, '#2fa352');
  u(ctx, x, y, -4 + sway, 0.5, 3, 2, '#25894a');
  u(ctx, x, y, 1.5 + sway, 0, 3, 2, '#25894a');
  u(ctx, x, y, -1.5 + sway, -5, 3, 1.6, '#3ac06a');
}

export function drawCoffee(ctx: CanvasRenderingContext2D, x: number, y: number, t: number, reduce: boolean) {
  // mostrador
  u(ctx, x, y, -9, 4, 18, 1.5, '#3a2c20');
  u(ctx, x, y, -9, 5.5, 18, 4.5, '#231a14');
  // cafetera
  u(ctx, x, y, -6, -4, 7, 8, '#2b3446');
  u(ctx, x, y, -6, -4, 7, 1.2, '#3b465c');
  u(ctx, x, y, -5, -1.5, 5, 3, '#0b0e14');
  const led = reduce || Math.floor(t / 600) % 2 === 0;
  u(ctx, x, y, -1.4, -3.2, 1, 1, led ? '#ff5964' : '#5a2a30');
  // taza
  u(ctx, x, y, 3, 2.2, 2.4, 1.8, '#e8edf3');
  u(ctx, x, y, 5.4, 2.6, 0.8, 1, '#e8edf3');
  // vapor
  if (!reduce) {
    for (let i = 0; i < 2; i++) {
      const p = ((t / 900 + i * 0.5) % 1);
      ctx.fillStyle = `rgba(255,255,255,${0.35 * (1 - p)})`;
      ctx.fillRect(Math.round(x + (3.6 + i * 1.1) * PX + Math.sin(t / 300 + i) * 2), Math.round(y + (1.5 - p * 4) * PX), 3, 3);
    }
  }
}

/** Alfombra del lounge + sofá + mesita. (x, y) = esquina superior izquierda. */
export function drawLounge(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = '#0f1a2b'; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = hexA('#00ffcc', 0.45); ctx.lineWidth = 2; ctx.strokeRect(x + 4, y + 4, w - 8, h - 8);
  ctx.strokeStyle = hexA('#ccff00', 0.25); ctx.lineWidth = 1; ctx.strokeRect(x + 10, y + 10, w - 20, h - 20);
  for (let i = x + 20; i < x + w - 20; i += 16) {
    ctx.fillStyle = hexA('#00ffcc', 0.12); ctx.fillRect(i, y + 14, 6, 3); ctx.fillRect(i, y + h - 17, 6, 3);
  }
  // sofá
  const sx = x + 24, sy = y + 12;
  const sw = Math.min(110, w - 120);
  if (sw > 50) {
    ctx.fillStyle = '#3b2f6b'; ctx.fillRect(sx, sy, sw, 16);
    ctx.fillStyle = '#4c3d8a'; ctx.fillRect(sx + 4, sy + 14, sw - 8, 14);
    ctx.fillStyle = '#2d2452'; ctx.fillRect(sx - 6, sy + 6, 8, 24); ctx.fillRect(sx + sw - 2, sy + 6, 8, 24);
  }
  // mesita
  const mx = x + w - 70, my = y + h / 2 - 8;
  ctx.fillStyle = '#4a3a2c'; ctx.fillRect(mx, my, 40, 18);
  ctx.fillStyle = '#5b4936'; ctx.fillRect(mx, my, 40, 3);
  ctx.fillStyle = '#e8edf3'; ctx.fillRect(mx + 8, my + 6, 8, 6);
  ctx.fillStyle = '#ccff00'; ctx.fillRect(mx + 24, my + 6, 8, 5);
}

// ------------------------------------------------------------
// Personajes
// ------------------------------------------------------------
function drawHead(
  ctx: CanvasRenderingContext2D, ox: number, oy: number, look: AgentLook,
  status: SpriteStatus, t: number, reduce: boolean,
) {
  const blink = !reduce && t % 3400 < 140;
  // pelo (atrás)
  if (look.style === 1) u(ctx, ox, oy, -4.5, -3, 9, 8, look.hair);
  // cara
  u(ctx, ox, oy, -3.5, -4, 7, 7, look.skin);
  u(ctx, ox, oy, -3.5, 2, 7, 1, hexA('#000000', 0.12));
  // pelo (arriba)
  u(ctx, ox, oy, -4, -5.2, 8, 2.6, look.hair);
  u(ctx, ox, oy, -4, -3, 1, 3, look.hair);
  u(ctx, ox, oy, 3, -3, 1, 3, look.hair);
  if (look.style === 2) u(ctx, ox, oy, -3, -2.6, 4, 1, look.hair);
  // ojos
  if (status === 'idle') {
    // entrecerrados
    u(ctx, ox, oy, -2.4, -0.4, 1.6, 0.5, '#2a1f1f');
    u(ctx, ox, oy, 0.8, -0.4, 1.6, 0.5, '#2a1f1f');
  } else if (status === 'error') {
    u(ctx, ox, oy, -2.5, -1.4, 1.8, 1.8, '#ffffff');
    u(ctx, ox, oy, 0.7, -1.4, 1.8, 1.8, '#ffffff');
    u(ctx, ox, oy, -1.9, -0.9, 0.8, 0.9, '#1b1f2a');
    u(ctx, ox, oy, 1.3, -0.9, 0.8, 0.9, '#1b1f2a');
  } else {
    const eh = blink ? 0.4 : 1.2;
    u(ctx, ox, oy, -2.2, -1, 1, eh, '#1b1f2a');
    u(ctx, ox, oy, 1.2, -1, 1, eh, '#1b1f2a');
  }
  // boca
  if (status === 'error') u(ctx, ox, oy, -0.8, 1.3, 1.6, 1.1, '#5a1f26');
  else u(ctx, ox, oy, -0.6, 1.5, 1.2, 0.4, '#a35a4a');
}

export interface StationOpts {
  sx: number;
  sy: number;
  status: SpriteStatus;
  look: AgentLook;
  t: number;
  reduce: boolean;
  hover: boolean;
  /** Si el agente está de pie caminando: desplazamiento horizontal en px. */
  walk?: { dx: number; moving: boolean } | null;
}

/** Dibuja escritorio + silla + agente (sentado o caminando) con animación por estado. */
export function drawStation(ctx: CanvasRenderingContext2D, o: StationOpts) {
  const { sx, sy, status, look, t, reduce, hover, walk } = o;
  const sc = STATUS_COLOR[status];
  const errOn = status === 'error' && !reduce && Math.floor(t / 300) % 2 === 0;
  const seated = !walk;

  // Resplandor de estado
  const gx = sx + 10 * PX, gy = sy + 4 * PX;
  const g = ctx.createRadialGradient(gx, gy, 4, gx, gy, 90);
  const alpha = status === 'error' ? (errOn ? 0.35 : 0.1) : status === 'active' ? 0.28 : 0.12;
  g.addColorStop(0, hexA(sc, alpha)); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(sx - 90, sy - 80, 220, 200);

  // Sombra + aro de estado en el suelo
  const gyG = sy + 19 * PX;
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath(); ctx.ellipse(sx + 2 * PX, gyG, 66, 9, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = hexA(sc, hover ? 0.95 : 0.45); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(sx + 2 * PX, gyG, 52, 7, 0, 0, Math.PI * 2); ctx.stroke();

  // Silla
  u(ctx, sx, sy, -5.5, -0.5, 11, 11, '#1a2030');
  u(ctx, sx, sy, -5.5, -0.5, 11, 1, '#2a3348');

  if (seated) drawSeatedWorker(ctx, sx, sy, look, status, t, reduce);

  // Escritorio
  u(ctx, sx, sy, -12, 10, 28, 2.4, '#4a3a2c');
  u(ctx, sx, sy, -12, 10, 28, 0.6, '#5b4936');
  u(ctx, sx, sy, -12, 12.4, 28, 5.6, '#2a2119');
  u(ctx, sx, sy, -12, 17.4, 28, 0.6, hexA(sc, 0.7));
  u(ctx, sx, sy, -11.5, 18, 1.5, 1.2, '#1a130e');
  u(ctx, sx, sy, 14, 18, 1.5, 1.2, '#1a130e');

  // Teclado
  u(ctx, sx, sy, -4, 9.4, 8, 1, '#11151d');
  for (let i = 0; i < 5; i++) u(ctx, sx, sy, -3.4 + i * 1.5, 9.6, 0.8, 0.4, '#2c3548');

  // Taza (con vapor si trabaja)
  u(ctx, sx, sy, -10, 8.4, 1.8, 1.6, '#e8edf3');
  u(ctx, sx, sy, -8.3, 8.8, 0.6, 0.9, '#e8edf3');
  if (status === 'active' && !reduce) {
    const p = (t / 1000) % 1;
    ctx.fillStyle = `rgba(255,255,255,${0.35 * (1 - p)})`;
    ctx.fillRect(Math.round(sx - 9.6 * PX), Math.round(sy + (7.6 - p * 3) * PX), 3, 3);
  }

  // Libro (en espera: lee)
  if (status === 'idle') {
    u(ctx, sx, sy, -3, 8.2, 3, 1.4, '#dfe6ee');
    u(ctx, sx, sy, 0, 8.2, 3, 1.4, '#c4cdd8');
    u(ctx, sx, sy, -0.2, 8.1, 0.4, 1.6, '#c9794f');
  }

  // Monitor
  u(ctx, sx, sy, 9.5, 8, 2, 1.5, '#1b2130');
  u(ctx, sx, sy, 8.5, 9.3, 4, 0.8, '#1b2130');
  u(ctx, sx, sy, 6, 0.5, 9, 7.5, '#05070c');
  const scr = status === 'error' ? (errOn ? 'rgba(255,89,100,0.45)' : 'rgba(255,89,100,0.12)') : hexA(sc, status === 'active' ? 0.22 : 0.1);
  u(ctx, sx, sy, 6.6, 1.1, 7.8, 6.3, scr);
  ctx.fillStyle = hexA(sc, status === 'idle' ? 0.35 : 0.85);
  for (let i = 0; i < 5; i++) {
    const lw = status === 'active' && !reduce ? 1.5 + ((Math.floor(t / 180) + i * 2) % 5) : 2 + (i % 3);
    ctx.fillRect(Math.round(sx + 7.2 * PX), Math.round(sy + (1.8 + i * 1.1) * PX), Math.min(lw, 6.4) * PX, Math.ceil(0.5 * PX));
  }
  if (status === 'error') {
    u(ctx, sx, sy, 10.2, 2, 0.8, 3, '#ffffff');
    u(ctx, sx, sy, 10.2, 5.6, 0.8, 0.8, '#ffffff');
  }

  if (walk) drawWalker(ctx, sx + walk.dx, sy, look, status, t, reduce, walk.moving);
}

function drawSeatedWorker(
  ctx: CanvasRenderingContext2D, sx: number, sy: number, look: AgentLook,
  status: SpriteStatus, t: number, reduce: boolean,
) {
  const breathe = status === 'idle' && !reduce ? Math.sin(t / 700) * 0.5 : 0;
  const hy = sy + breathe * PX * 0.6;
  // torso
  u(ctx, sx, sy, -4, 3.6, 8, 6.4, look.shirt);
  u(ctx, sx, sy, -4, 3.6, 8, 1, 'rgba(255,255,255,0.12)');
  u(ctx, sx, sy, -0.5, 3.6, 1, 6.4, 'rgba(0,0,0,0.15)');
  // cuello
  u(ctx, sx, hy, -1.2, 2.6, 2.4, 1.2, look.skin);
  drawHead(ctx, sx, hy, look, status, t, reduce);

  if (status === 'active') {
    // brazos al teclado, manos alternando
    const ph = reduce ? 0 : Math.floor(t / 90) % 2;
    u(ctx, sx, sy, -5.6, 4.4, 1.7, 5, look.shirt);
    u(ctx, sx, sy, 3.9, 4.4, 1.7, 5, look.shirt);
    u(ctx, sx, sy, -4.6, 8.6 - (ph ? 0.6 : 0), 1.8, 1.2, look.skin);
    u(ctx, sx, sy, 2.8, 8.6 - (ph ? 0 : 0.6), 1.8, 1.2, look.skin);
  } else if (status === 'error') {
    // brazos arriba, saludando/alertando
    const up = !reduce && Math.floor(t / 250) % 2 === 0;
    u(ctx, sx, sy, -6, up ? 0.4 : 1.2, 1.7, 5, look.shirt);
    u(ctx, sx, sy, 4.3, up ? 1.2 : 0.4, 1.7, 5, look.shirt);
    u(ctx, sx, sy, -6, up ? -0.8 : 0, 1.8, 1.4, look.skin);
    u(ctx, sx, sy, 4.2, up ? 0 : -0.8, 1.8, 1.4, look.skin);
  } else {
    // en espera: sostiene el libro
    u(ctx, sx, sy, -5.6, 4.4, 1.7, 4.6, look.shirt);
    u(ctx, sx, sy, 3.9, 4.4, 1.7, 4.6, look.shirt);
    u(ctx, sx, sy, -4.4, 8.4, 1.6, 1.2, look.skin);
    u(ctx, sx, sy, 2.8, 8.4, 1.6, 1.2, look.skin);
  }
}

function drawWalker(
  ctx: CanvasRenderingContext2D, wx: number, sy: number, look: AgentLook,
  status: SpriteStatus, t: number, reduce: boolean, moving: boolean,
) {
  const step = moving && !reduce ? Math.floor(t / 140) % 2 : 0;
  const by = sy + 1.5 * PX; // un poco más abajo, delante del escritorio
  // sombra
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath(); ctx.ellipse(wx, by + 18.4 * PX, 24, 5, 0, 0, Math.PI * 2); ctx.fill();
  // piernas
  u(ctx, wx, by, -3, 10, 2.6, 6 - (step ? 0.8 : 0), '#2a3142');
  u(ctx, wx, by, 0.4, 10, 2.6, 6 - (step ? 0 : 0.8), '#2a3142');
  u(ctx, wx, by, -3.4, 16 - (step ? 0.8 : 0), 3, 1.1, '#11151d');
  u(ctx, wx, by, 0.4, 16 - (step ? 0 : 0.8), 3, 1.1, '#11151d');
  // torso + brazos oscilando
  u(ctx, wx, by, -4, 3.6, 8, 6.6, look.shirt);
  u(ctx, wx, by, -4, 3.6, 8, 1, 'rgba(255,255,255,0.12)');
  u(ctx, wx, by, -5.6, 4.2 + (step ? 0.6 : 0), 1.7, 5, look.shirt);
  u(ctx, wx, by, 3.9, 4.2 + (step ? 0 : 0.6), 1.7, 5, look.shirt);
  u(ctx, wx, by, -5.6, 9 + (step ? 0.6 : 0), 1.7, 1.2, look.skin);
  u(ctx, wx, by, 3.9, 9 + (step ? 0 : 0.6), 1.7, 1.2, look.skin);
  u(ctx, wx, by, -1.2, 2.6, 2.4, 1.2, look.skin);
  drawHead(ctx, wx, by, look, status, t, reduce);
  // taza en la mano cuando se detiene
  if (!moving) {
    u(ctx, wx, by, 5.2, 8, 1.8, 1.6, '#e8edf3');
  }
}

// ------------------------------------------------------------
// Burbujas de diálogo / estado
// ------------------------------------------------------------
export function drawBubble(
  ctx: CanvasRenderingContext2D, cx: number, cy: number, text: string,
  color: string, opts: { font?: string; bg?: string } = {},
) {
  ctx.save();
  ctx.font = opts.font ?? '600 11px Inter, sans-serif';
  ctx.textAlign = 'center';
  const padX = 8;
  const w = Math.max(24, Math.ceil(ctx.measureText(text).width) + padX * 2);
  const h = 22;
  const x = Math.round(cx - w / 2), y = Math.round(cy - h);
  ctx.fillStyle = opts.bg ?? 'rgba(13,17,23,0.96)';
  ctx.fillRect(x, y, w, h);
  ctx.fillRect(x + 2, y - 2, w - 4, 2);
  ctx.fillRect(x + 2, y + h, w - 4, 2);
  ctx.strokeStyle = hexA(color, 0.8); ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  // cola
  ctx.fillStyle = opts.bg ?? 'rgba(13,17,23,0.96)';
  ctx.fillRect(Math.round(cx) - 3, y + h + 2, 6, 3);
  ctx.fillRect(Math.round(cx) - 1, y + h + 5, 2, 2);
  ctx.fillStyle = color;
  ctx.fillText(text, cx, y + 15);
  ctx.restore();
}

/** Frases de actividad por agente (deterministas por nombre, rotan con el tiempo). */
const ACTIVITY = ['Redactando respuesta…', 'Analizando datos…', 'Calificando leads…', 'Compilando reporte…', 'Sincronizando CRM…'];
export function activityText(name: string, t: number): string {
  const h = hashStr(name);
  return ACTIVITY[(h + Math.floor(t / 6000)) % ACTIVITY.length];
}
