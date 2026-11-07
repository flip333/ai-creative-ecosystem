// Oficina del Crew IA de Genflow — adaptada del kit "oficina-animada" (motor en index.html).
// Estética verde neón futurista. Santiago es el humano (director); los 11 agentes del Crew
// trabajan en salas por área. El estado se lee de estado.json (servido estático por Next).
window.OFICINA = {
  titulo: "Oficina del Crew IA",

  estado: { url: "estado.json", cadaMs: 2000 },

  planta: { ancho: 26, alto: 20, muro: 118 },

  // Paleta verde neón futurista. Las salas y la decoración referencian estas claves.
  paleta: {
    acento: "#ccff00",  // lima
    teal:   "#00ffcc",
    verde:  "#39ff14",
    cian:   "#00e5ff",
    menta:  "#7cffb2",
    crema:  "#cfe6d8",
    rosa:   "#39ff14",   // alias para decoración heredada
    azul:   "#00e5ff",
    naranja:"#7cffb2",
    violeta:"#00ffcc",
  },

  marca: { titulo: "GENFLOW", subtitulo: "CREW IA · AUTOMATIZACIÓN E IA", en: 9.4 },
  neon: { texto: "GENFLOW", x: 21.6, y: 0, color: "acento" },

  textos: {
    reunion: "Daily del Crew",
    trabajando: "Sprint activo · {n} agentes en tarea",
    quieto: "Sin sprint activo · el Crew está en la oficina",
    estados: { trabajando: "Trabajando", listo: "Entregó", libre: "Disponible" },
  },

  // Salas por área del Crew. Piso oscuro futurista; color = neón del área.
  salas: [
    { id: "direccion", nombre: "Dirección",                      x0: 0,  x1: 7,  y0: 0,  y1: 7,  piso: "concreto", tono: ["#101a16", "#132019"], color: "acento", letrero: [3.2, 6.9] },
    { id: "arq",       nombre: "Arquitectura & Fiabilidad",      x0: 8,  x1: 16, y0: 0,  y1: 7,  piso: "concreto", tono: ["#0e1a1f", "#102029"], color: "teal",   letrero: [12, 6.9] },
    { id: "prod",      nombre: "Producto IA & Construcción",     x0: 17, x1: 25, y0: 0,  y1: 7,  piso: "concreto", tono: ["#121f12", "#162617"], color: "verde",  letrero: [20.6, 6.9] },
    { id: "pasillo",   nombre: "",                               x0: 0,  x1: 25, y0: 8,  y1: 9,  piso: "pasillo",  tono: ["#0b0f0e", "#0d120f"], color: "#2a3a30" },
    { id: "juntas",    nombre: "Sala de juntas",                 x0: 0,  x1: 10, y0: 10, y1: 19, piso: "alfombra", tono: ["#0f1a20", "#122029"], color: "crema",  letrero: [5.4, 17.9], reunion: true },
    { id: "exp",       nombre: "Experiencia, Calidad & Entrega", x0: 11, x1: 17, y0: 10, y1: 19, piso: "concreto", tono: ["#0e1f16", "#11261b"], color: "cian",   letrero: [14.4, 17.4] },
    { id: "recepcion", nombre: "Recepción y café",               x0: 18, x1: 25, y0: 10, y1: 19, piso: "baldosa",  tono: ["#121b14", "#0f1710"], color: "menta",  letrero: [22, 18.4] },
  ],

  muros: [
    { tipo: "n", en: 8,  desde: 0, hasta: 25, puertas: [3, 4, 11, 12, 20, 21] },
    { tipo: "n", en: 10, desde: 0, hasta: 25, puertas: [4, 5, 6, 13, 14, 20, 21, 22] },
    { tipo: "o", en: 8,  desde: 0,  hasta: 7 },
    { tipo: "o", en: 17, desde: 0,  hasta: 7 },
    { tipo: "o", en: 11, desde: 10, hasta: 19 },
    { tipo: "o", en: 18, desde: 10, hasta: 19 },
  ],
  pasillo: [0.6, 8.35, 25.4, 9.65],

  // Muebles: [tipo, x, y, ancho, fondo, alto, extra]. Escritorios con dueno = nombre del agente.
  muebles: [
    // Dirección: Santiago, Product Owner, Scrum Master
    ["escritorio", 1, 3, 2, 1, 24, { dueno: "Santiago" }],
    ["escritorio", 4, 3, 2, 1, 24, { dueno: "Product Owner" }],
    ["escritorio", 1, 5, 2, 1, 24, { dueno: "Scrum Master" }],
    ["estante", 0, 0, 1, 2, 82], ["planta", 7, 0, 1, 1, 50], ["lampara", 6, 6, 1, 1, 80],
    // Arquitectura & Fiabilidad: Arquitecto, Seguridad, DevOps
    ["escritorio", 9, 3, 2, 1, 24, { dueno: "Arquitecto" }],
    ["escritorio", 12, 3, 2, 1, 24, { dueno: "Seguridad" }],
    ["escritorio", 15, 3, 2, 1, 24, { dueno: "DevOps" }],
    ["archivo", 8, 0, 1, 2, 76], ["archivador", 16, 0, 1, 1, 48], ["globo", 8, 6, 1, 1, 46], ["libros", 16, 6, 1, 1, 30],
    // Producto IA & Construcción: AI & Automation, Backend & APIs, Frontend
    ["escritorio", 18, 3, 2, 1, 24, { dueno: "AI & Automation" }],
    ["escritorio", 21, 3, 2, 1, 24, { dueno: "Backend & APIs" }],
    ["escritorio", 24, 3, 2, 1, 24, { dueno: "Frontend" }],
    ["tocadiscos", 17, 0, 1, 2, 34], ["camara", 24, 6, 1, 1, 52], ["planta", 17, 6, 1, 1, 42],
    // Juntas
    ["mesa", 2, 13, 6, 2, 22], ["pantalla", 9, 11, 1, 3, 62], ["planta", 0, 19, 1, 1, 50], ["planta", 10, 19, 1, 1, 50], ["escultura", 9, 17, 1, 1, 64],
    // Experiencia, Calidad & Entrega: UX/UI, QA, Delivery/CRM
    ["escritorio", 12, 13, 2, 1, 24, { dueno: "UX/UI" }],
    ["escritorio", 15, 13, 2, 1, 24, { dueno: "QA" }],
    ["escritorio", 12, 15, 2, 1, 24, { dueno: "Delivery/CRM" }],
    ["tablero", 16, 16, 1, 2, 62], ["planta", 11, 18, 1, 1, 42],
    // Recepción y café
    ["barra", 19, 11, 3, 1, 32], ["cafetera", 22, 11, 1, 1, 46], ["sofa", 19, 16, 3, 1, 20],
    ["escultura", 24, 14, 1, 1, 70, { forma: "aro" }], ["planta", 25, 10, 1, 1, 50], ["planta", 18, 19, 1, 1, 42],
  ],

  alfombras: [
    { x: 1, y: 1, w: 6, d: 5, color: "#0f2018", borde: "acento", patron: "rombos" },
    { x: 18, y: 1, w: 6, d: 5, color: "#12201c", borde: "verde", patron: "manchas" },
    { x: 1, y: 11, w: 8, d: 6, color: "#0e1a20", borde: "teal", patron: "lineas" },
    { x: 18, y: 13, w: 5, d: 4, color: "#0f2016", borde: "menta", patron: "circulo" },
  ],
  // Charcos de luz verdes/teal/lima
  luces: [
    [3, 3.5, 150, "204,255,0"], [5, 5.5, 120, "204,255,0"], [6.5, 2.5, 110, "180,255,120"],
    [10, 3.5, 120, "0,255,204"], [13, 3.5, 120, "0,255,204"], [16, 3.5, 110, "0,255,204"],
    [19, 3.5, 120, "57,255,20"], [22, 3.5, 120, "57,255,20"], [24.5, 2.5, 120, "180,255,140"],
    [5, 14, 200, "204,255,0"], [14, 13.5, 130, "0,229,255"], [21, 12, 140, "120,255,180"], [21, 15, 130, "120,255,180"],
    [9.5, 17.5, 90, "204,255,0"], [24.5, 14.5, 100, "120,255,180"],
  ],

  paredes: {
    ventanas: [["d", 0.6, 2.6], ["d", 8.6, 10.4], ["d", 17.8, 20.6], ["d", 24.3, 25.7], ["i", 10.6, 12.8], ["i", 16.6, 18.8]],
    cuadros: [["d", 3.5, 6.6, 40, 96, 11], ["i", 13.4, 15.6, 40, 90, 23], ["d", 22.7, 23.9, 50, 80, 31]],
    pizarras: [["d", 10.8, 13.8]],
    corchos: [["d", 14.4, 16.4]],
    afiches: [["d", 20.7, 21.1, "verde"]],
  },

  // Equipo: Santiago (humano) + los 11 agentes del Crew IA.
  equipo: [
    { nombre: "Santiago",        depto: "Dirección",                      sprite: "santiago",                casa: [1, 2],  silla: [1, 12], miraSilla: "front-right", humano: true, cargo: "Director de Genflow" },
    { nombre: "Product Owner",   depto: "Dirección",                      sprite: "lider",                   casa: [4, 2],  silla: [3, 12] },
    { nombre: "Scrum Master",    depto: "Dirección",                      sprite: "extra/employee-1",        casa: [1, 4],  silla: [5, 12] },
    { nombre: "Arquitecto",      depto: "Arquitectura & Fiabilidad",      sprite: "extra/explore-1",         casa: [9, 2],  silla: [7, 12] },
    { nombre: "Seguridad",       depto: "Arquitectura & Fiabilidad",      sprite: "extra/security-audit-1",  casa: [12, 2], silla: [8, 13] },
    { nombre: "DevOps",          depto: "Arquitectura & Fiabilidad",      sprite: "extra/dev-1",             casa: [15, 2], silla: [1, 14] },
    { nombre: "AI & Automation", depto: "Producto IA & Construcción",     sprite: "extra/claude-1",          casa: [18, 2], silla: [8, 15] },
    { nombre: "Backend & APIs",  depto: "Producto IA & Construcción",     sprite: "extra/dev-2",             casa: [21, 2], silla: [1, 16] },
    { nombre: "Frontend",        depto: "Producto IA & Construcción",     sprite: "extra/frontend-dev-1",    casa: [24, 2], silla: [3, 16] },
    { nombre: "UX/UI",           depto: "Experiencia, Calidad & Entrega", sprite: "guionista",               casa: [12, 12], silla: [5, 16], miraSilla: "rear-right" },
    { nombre: "QA",              depto: "Experiencia, Calidad & Entrega", sprite: "auditor",                 casa: [15, 12], silla: [7, 16], miraSilla: "rear-right" },
    { nombre: "Delivery/CRM",    depto: "Experiencia, Calidad & Entrega", sprite: "copywriter",              casa: [12, 14], silla: [3, 18], miraSilla: "rear-right" },
  ],
  paseos: [[20, 12], [21, 12], [23, 13], [20, 15], [23, 17], [13, 9], [6, 9], [22, 9], [7, 11], [23, 6], [10, 6], [19, 6]],
};
