# Crew IA — Equipo de desarrollo de Genflow

Equipo de agentes estratégicos de Claude Code, organizados bajo **SCRUM**, para desarrollar
y operar el ecosistema de Genflow (landing + portal cliente + CRM interno) con arquitectura escalable.

Cada rol es un subagente real: invócalo con el Agent tool o pídelo por nombre
(ej. *"usa genflow-arquitecto para diseñar el módulo de facturación"*).

## Roles

| Agente | Rol | Cuándo llamarlo |
|---|---|---|
| `genflow-product-owner` | Product Owner | Priorizar backlog, escribir historias y criterios de aceptación |
| `genflow-scrum-master` | Scrum Master | Montar/mejorar el proceso SCRUM, ceremonias, impedimentos |
| `genflow-arquitecto` | Arquitecto / Tech Lead | Arquitectura escalable, módulos, datos, multi-tenant, ADRs |
| `genflow-ux-ui` | UX/UI + Research | Lectura del usuario, personas, journeys, diseño de pantallas |
| `genflow-seguridad` | AppSec / Seguridad | RLS, auth, secretos, headers, gate antes de deploy |
| `genflow-backend-api` | Backend, Datos & APIs | Server Actions, Supabase, migraciones, integraciones API |
| `genflow-frontend` | Frontend / Portal | UI Next.js, dashboard, estados, componentes on-brand |
| `genflow-devops` | DevOps / Reliability | Vercel, CI/CD, entornos, observabilidad, continuidad |
| `genflow-qa` | QA / Calidad | Casos de prueba, aislamiento multi-tenant, regresión, E2E |
| `genflow-delivery-crm` | Delivery & CRM interno | Onboarding, playbooks de implementación, CRM como herramienta |
| `genflow-ai-automation` | AI & Automation | Los flujos de IA del catálogo — el producto que se vende |

## Cadencia SCRUM

Sprints de 2 semanas · Planning → Daily → Refinement (mitad) → Review → Retro.
Tablero: `Backlog → Listo para sprint → En progreso → En revisión → Hecho` con WIP limitado.

## Definition of Done (compartida)

- Tipos TypeScript estrictos, sin `any`; `npm run build` pasa.
- RLS habilitado y probado (incl. prueba negativa) en toda tabla tocada.
- Validación de inputs en servidor; sin secretos en `NEXT_PUBLIC_`.
- Accesible (AA, teclado), responsive mobile-first, probado en la preview real.

## Skills de apoyo

- `webdev-methodology` — stack, arquitectura, seguridad, deploy.
- `genflow-content` — sistema de marca y contenido.
- `claude-api` — modelos, precios y límites de Claude (para `genflow-ai-automation`).
- `dataviz` — gráficos del dashboard.
- `security-review` / `code-review` — gates de calidad y seguridad del diff.
