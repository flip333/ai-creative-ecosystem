# TASK: Integración No Destructiva del "Cerebro Digital" en la Rama Portal

Actúa como Lead Frontend Engineer & Software Architect de Genflow. 

Tu objetivo es integrar la nueva propuesta de valor visual y narrativa del **"Cerebro Digital" (Knowledge Graph Interactivo)** dentro del portal existente (`feat-portal`), **MANTENIENDO INTACTA** la funcionalidad, estilos globales, componentes y estructuras de rutas que ya están construidas y desplegadas.

---

## ⚠️ REGLAS BÁSICAS (LEER ANTES DE CODIFICAR)

1. **PROHIBIDO SOBREESCRIBIR O DESTRUIR:** No borres páginas, componentes ni layouts existentes salvo que sea para envolverlos o extenderlos.
2. **MODULARIDAD Y AISLAMIENTO:** Toda la nueva funcionalidad del Cerebro Digital debe residir en componentes desacoplados dentro de un nuevo directorio (`/components/brain/` o `/components/digital-brain/`).
3. **FEATURE FLAG / FALLBACK:** El canvas y la narrativa del Cerebro Digital deben montarse de forma modular para que, si falla la renderización del grafo (ej. SSR o WebGL), el dashboard siga siendo 100% funcional.
4. **RESPETO AL SISTEMA DE DISEÑO:** Utiliza estrictamente las clases de Tailwind, colores, fuentes y primitivas de UI (botones, cards, badges) que ya se están usando en la aplicación.

---

## 🔍 PASO 1: AUDITORÍA Y DIAGNÓSTICO (Sin modificar código)

Primero, analiza el estado actual del repositorio:
- Identifica la ruta principal del portal (ej. `/dashboard`, `/projects/[id]` o `/portal`).
- Revisa el layout general (`Header`, `Sidebar`, contenedores principales).
- Identifica los componentes de UI reutilizables existentes (Cards, Badges, Modals, etc.).
- Comprueba si existe alguna librería de grafos/canvas instalada (`react-force-graph`, `vis-network`, `lucide-react`, etc.) o si se requiere agregar `react-force-graph-2d`.

---

## 🛠️ PASO 2: ESTRUCTURA DE COMPONENTES A CREAR

Crea únicamente los siguientes componentes aislados:

1. `src/components/brain/DigitalBrainCanvas.tsx`
   - Renderizador del grafo interconectado usando `react-force-graph-2d` montado con `next/dynamic` (`ssr: false`) para evitar errores de hidratación.
   - Debe aceptar datos por props y adaptarse al 100% del tamaño de su contenedor padre (`width` y `height` dinámicos).

2. `src/components/brain/brainData.ts`
   - Esquema de TypeScript (`BrainNode`, `BrainLink`) y Mock Data inicial enriquecido con la nomenclatura de Genflow (Identidad, Agentes IA, Automatizaciones, Assets).

3. `src/components/brain/BrainHeaderStats.tsx`
   - Barra o bloque de KPIs (Conocimiento Indexado, Sinapsis Activas, Agentes Operativos) diseñado con la misma estética de las cards actuales del portal.

4. `src/components/brain/BrainControls.tsx`
   - Filtros por categoría (Estrategia, Agentes, Workflows, Entregables) y estado de sincronización.

---

## 🚀 PASO 3: INTEGRACIÓN EN EL LAYOUT EXISTENTE

- Ubica la vista principal del proyecto o portal.
- Integra el `BrainHeaderStats` y el `DigitalBrainCanvas` en una sección destacada (ya sea como una vista superior o como una nueva pestaña/tab dentro de la navegación del proyecto existente, ej. `[ 🧠 Cerebro Digital | 📊 Métricas | ⚙️ Configuración ]`).
- Asegúrate de que las vistas anteriores del portal sigan accesibles sin interrupción.

**Por favor, comienza ejecutando la auditoría del proyecto y mostrándome tu plan de integración archivo por archivo antes de aplicar los cambios.**
