# Plan Maestro de Desarrollo — Plataforma Genflow

Backlog completo de la plataforma (landing + portal del usuario + portal interno/CRM +
backend), dividido entre los 11 agentes del Crew IA. Parte de lo que **ya existe y funciona**
y lista lo que falta para salir a producción.

Metodología: SCRUM, sprints de 2 semanas. El `genflow-product-owner` prioriza; el
`genflow-scrum-master` facilita; cada tarea tiene un **owner** del crew.

---

## 0. Estado actual (ya funciona)

**Frontend / superficies**
- ✅ Landing pública (`app/(marketing)`): hero, soluciones, beneficios, metodología, diagnóstico.
- ✅ Portal del usuario (`app/portal`): home (KPIs), **Mi Oficina IA** (2D realtime), flows, docs (datos reales), billing (CSV), support. Estados de carga/vacío/error.
- ✅ Portal interno / CRM (`app/admin`): **Oficina del Crew**, dashboard, clientes (invitar/editar), **leads**, **flujos (CRUD)**, facturación, tickets, equipo.

**Backend / plataforma**
- ✅ Supabase `qrgrzbkjngbgvbzesvaf`: tablas `profiles`, `automations`(+`automation_logs`), `billing_records`, `support_tickets`, `diagnostics`, `office_agents`. RLS por cliente + admin. Realtime en `office_agents`.
- ✅ Auth invite-only (cookie), 3 capas de seguridad, headers (Fase 0), hook `useSupabaseAgents`.
- ✅ Crew IA: 11 subagentes con skills y conexiones.

**Pendiente de entorno**
- ⬜ `SUPABASE_SERVICE_ROLE_KEY` en `.env.local` y Vercel (habilita invitaciones).
- ⬜ Dominio Hostinger → Vercel + variables de producción.

---

## 1. Épicas y desarrollos

### E1 · Oficina pixel-agents (estética + funcionalidad)  ·  owner: `genflow-frontend` + `genflow-ux-ui`
Adoptar el look/funcionalidad de **pixel-agents** (MIT, Canvas 2D, sin WebGL) en `/portal/oficina` y en la Oficina del Crew interna.
- Personajes pixel con estados: caminar al escritorio, sentarse, **teclear** (activo), **leer/espera** (idle), **alerta** (error).
- Oficina con mobiliario, pisos y paredes por tiles; burbujas de diálogo con la última ejecución.
- **Assets:** el arte de personajes de pixel-agents es del pack *Metro City (JIK-A-4, itch.io)* con licencia propia → o verificamos esa licencia (uso comercial + atribución) o usamos **sprites propios** en ese estilo. Decisión del PO.
- Multicliente: cada cliente ve su oficina (ya cableado a `office_agents` + realtime).

### E2 · Flujo de cliente real end-to-end  ·  owner: `genflow-delivery-crm` + `genflow-backend-api`
- `SUPABASE_SERVICE_ROLE_KEY` en entorno → **invitaciones** funcionando (`inviteClient`).
- Onboarding por etapas (`profiles.status`: onboarding→activo) con hitos en el CRM.
- Del lead (`diagnostics`) al cliente activo en un paso.
- Sincronizar `automations` ↔ `office_agents` (cada flujo genera/actualiza su agente en la oficina).

### E3 · Motor de ejecuciones (trazabilidad)  ·  owner: `genflow-backend-api` + `genflow-ai-automation`
- `POST /api/v1/executions` firmado (HMAC), idempotente → escribe `automation_logs`, actualiza `status`.
- Adaptador de runtime (n8n/Make/Edge Functions).
- Vista de ejecuciones + KPI por flujo en el portal.

### E4 · UX/UI y dashboard  ·  owner: `genflow-ux-ui` + `genflow-frontend`
- Rediseño `/portal/home` (valor en 10 s, tendencia con `dataviz`).
- Pulido de landing (coherencia, accesibilidad AA, mobile-first).
- CRM: vista triage "clientes que necesitan atención hoy".

### E5 · Seguridad y calidad  ·  owner: `genflow-seguridad` + `genflow-qa`
- CSP report-only → enforce (probada vs three/framer/Supabase).
- Rate limiting (Upstash + Vercel KV) en acciones públicas y webhooks.
- **Prueba negativa de RLS** por tabla, automatizada en CI.
- E2E de flujos críticos (auth, aislamiento, tickets, billing).

### E6 · Pagos y facturación  ·  owner: `genflow-backend-api` + `genflow-seguridad`
- Pasarela **Wompi o ePayco** (Colombia) + webhook idempotente + tabla `payment_events`.
- Facturación del portal conectada a pagos reales.

### E7 · Producción y observabilidad  ·  owner: `genflow-devops`
- Dominio Hostinger → Vercel (A `@`→`76.76.21.21`, CNAME `www`), SSL, variables por entorno.
- Supabase Auth Site URL/Redirects al dominio; continuidad de Supabase.
- Vercel Analytics + Sentry; CI gate (build+typecheck+tests).
- **Nota:** Vercel Hobby es no-comercial → subir a Pro antes de cobrar.

### E8 · Producto IA (catálogo)  ·  owner: `genflow-ai-automation`
- Implementar servicios del catálogo como flujos reales con su métrica (Agente de Ventas, RAG, Triaje…).
- Biblioteca de prompts versionada (ya hay `master_prompt`).

---

## 2. División por agente (matriz)

| Agente | Épicas que lidera | Apoya |
|---|---|---|
| `genflow-product-owner` | Prioriza todo; decide assets E1, pasarela E6 | — |
| `genflow-scrum-master` | Proceso, destrabar | — |
| `genflow-arquitecto` | Contratos E2/E3/E6, multi-tenancy | Revisa todo |
| `genflow-frontend` | **E1**, E4 | E2, E3 |
| `genflow-ux-ui` | **E4**, E1 | — |
| `genflow-backend-api` | **E2**, **E3**, E6 | E5 |
| `genflow-ai-automation` | **E8**, E3 | E1 |
| `genflow-seguridad` | **E5**, E6 | gate de deploy |
| `genflow-qa` | **E5** (tests) | acepta incrementos |
| `genflow-devops` | **E7** | E5 |
| `genflow-delivery-crm` | **E2** (onboarding/CRM) | E4 |

---

## 3. Secuencia de sprints

- **Sprint 1 (ahora):** E2 (service role + invitaciones + sync automations↔office_agents) · E1 (oficina pixel v1) · E5 (prueba negativa RLS).
- **Sprint 2:** E3 (motor de ejecuciones) · E4 (dashboard + home).
- **Sprint 3:** E6 (pagos) · E7 (dominio + prod + observabilidad).
- **Sprint 4:** E8 (servicios del catálogo) · pulido y go-live.

---

## 4. Cómo ejecutamos con el crew (sin conflictos)

La plataforma es **una sola app Next.js**, así que dos agentes no deben escribir los mismos
archivos a la vez. Reglas:
1. **Un escritor por área a la vez.** Las áreas (landing / portal / admin / lib-backend / infra)
   se asignan por tarea; tareas en la misma área se **secuencian**, no se paralelizan.
2. Tareas en áreas disjuntas sí corren en paralelo (ej. `genflow-devops` en infra mientras
   `genflow-frontend` en una vista).
3. Cada agente entrega con la **Definition of Done** compartida (tipos, RLS probada, build verde,
   probado en preview) y hace handoff al `genflow-qa` / `genflow-seguridad` como gate.
4. El `genflow-product-owner` acepta cada incremento contra su criterio.

Arranque sugerido: desbloquear **E2** (service role key — lo pega el humano) en paralelo con
**E1** (oficina pixel, área portal) y **E5-RLS** (área tests), que no se pisan.
