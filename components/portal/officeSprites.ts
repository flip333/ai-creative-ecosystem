// Sprites SVG on-brand para Mi Oficina IA — ilustraciones vectoriales planas
// con acentos neon, dibujadas a mano (sin assets externos, licencia propia).
// Se cargan como texturas en PixiJS. width/height = 2x viewBox para nitidez retina.

export function charSVG(shirt: string, shirtDark: string, hair: string, skin = '#f1c9a5'): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="88" height="120" viewBox="0 0 44 60">
    <rect x="14" y="40" width="6" height="14" rx="3" fill="#232a35"/>
    <rect x="24" y="40" width="6" height="14" rx="3" fill="#232a35"/>
    <rect x="13" y="52" width="8" height="4" rx="2" fill="#11151d"/>
    <rect x="23" y="52" width="8" height="4" rx="2" fill="#11151d"/>
    <rect x="10" y="26" width="24" height="20" rx="8" fill="${shirt}"/>
    <path d="M10 35 q12 7 24 0 v7 q-12 6 -24 0 z" fill="${shirtDark}" opacity="0.55"/>
    <rect x="20" y="30" width="4" height="4" rx="2" fill="#ccff00"/>
    <rect x="6" y="28" width="6" height="14" rx="3" fill="${shirt}"/>
    <rect x="32" y="28" width="6" height="14" rx="3" fill="${shirt}"/>
    <rect x="18" y="22" width="8" height="6" rx="2" fill="${skin}"/>
    <rect x="13" y="8" width="18" height="18" rx="9" fill="${skin}"/>
    <path d="M13 17 q0 -12 9 -12 q9 0 9 12 q-3 -6 -9 -6 q-6 0 -9 6 z" fill="${hair}"/>
    <circle cx="19" cy="17" r="1.6" fill="#1b1f2a"/>
    <circle cx="26" cy="17" r="1.6" fill="#1b1f2a"/>
    <path d="M18 21 q4 2 8 0" stroke="#d99" stroke-width="0.8" fill="none" opacity="0.5"/>
  </svg>`;
}

export const DESK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="312" height="130" viewBox="0 0 156 65">
  <ellipse cx="78" cy="60" rx="74" ry="6" fill="#000" opacity="0.3"/>
  <rect x="6" y="16" width="144" height="8" rx="3" fill="#1b222e"/>
  <rect x="6" y="15" width="144" height="2.5" rx="1" fill="#ccff00" opacity="0.45"/>
  <rect x="6" y="24" width="144" height="18" rx="2" fill="#0b0e14"/>
  <rect x="12" y="42" width="7" height="18" rx="2" fill="#0b0e14"/>
  <rect x="137" y="42" width="7" height="18" rx="2" fill="#0b0e14"/>
</svg>`;

export const MONITOR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="112" viewBox="0 0 60 56">
  <rect x="27" y="40" width="6" height="8" fill="#05070c"/>
  <rect x="20" y="46" width="20" height="4" rx="2" fill="#05070c"/>
  <rect x="6" y="4" width="48" height="38" rx="4" fill="#05070c"/>
  <rect x="10" y="8" width="40" height="30" rx="2" fill="#0a0f16"/>
</svg>`;

export const PLANT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="88" height="112" viewBox="0 0 44 56">
  <ellipse cx="22" cy="52" rx="14" ry="4" fill="#000" opacity="0.3"/>
  <path d="M14 42 h16 l-2 12 h-12 z" fill="#2a1f14"/>
  <path d="M14 42 h16 l-0.6 3 h-14.8 z" fill="#3a2b1c"/>
  <ellipse cx="22" cy="34" rx="5" ry="13" fill="#1ea7a0"/>
  <ellipse cx="14" cy="34" rx="4" ry="11" fill="#17857f" transform="rotate(-22 14 34)"/>
  <ellipse cx="30" cy="34" rx="4" ry="11" fill="#22c2b8" transform="rotate(22 30 34)"/>
  <ellipse cx="22" cy="30" rx="3" ry="8" fill="#2fe0d4"/>
</svg>`;

export const COFFEE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="72" height="104" viewBox="0 0 36 52">
  <ellipse cx="18" cy="48" rx="12" ry="3" fill="#000" opacity="0.3"/>
  <rect x="6" y="6" width="24" height="38" rx="3" fill="#11161f"/>
  <rect x="6" y="6" width="24" height="3" rx="1.5" fill="#1b222e"/>
  <rect x="10" y="13" width="16" height="7" rx="1.5" fill="#ccff00" opacity="0.65"/>
  <rect x="12" y="32" width="12" height="7" rx="1.5" fill="#05070c"/>
  <rect x="15" y="26" width="6" height="4" rx="1" fill="#00ffcc" opacity="0.7"/>
</svg>`;
