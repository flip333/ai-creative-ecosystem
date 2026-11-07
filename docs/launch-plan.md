# Plan de Lanzamiento — Genflow

> De lo que hay hoy a una plataforma lanzable. Cada fase es un incremento que el
> cliente (o el consultor) puede usar de verdad. El orden prioriza: primero lo que
> evita deuda y fuga de datos, luego el valor que se siente, luego cobrar y escalar.
>
> Metodología: SCRUM, sprints de 2 semanas. Owners = roles del Crew IA.

---

## Estado base (ya hecho)

- ✅ Crew IA (11 subagentes) + modelo SCRUM.
- ✅ Oficina Virtual del admin con pestañas (Clientes, Leads, Flujos, Facturación, Tickets, Equipo) + **Oficina del Crew** (command center).
- ✅ Fase 0 parcial: headers de seguridad, source maps off.
- ✅ Backend reconstruido en Supabase `qrgrzbkjngbgvbzesvaf` (schema + RLS + admin).

---

## Fase 1 — Flujo de cliente real (end-to-end)  ·  *lanzable mínimo*
**Meta:** invitar a un cliente y que entre a ver sus datos reales, sin tocar SQL.

| Feature | Owner | Criterio de aceptación |
|---|---|---|
| Service role key en `.env.local` + Vercel | `genflow-devops` | El botón "invitar cliente" crea el usuario y envía invitación |
| Invitación → onboarding → activo | `genflow-delivery-crm` | Un cliente nuevo recorre `onboarding → activo` con hitos visibles |
| Alta de flujos por cliente (CRUD en CRM) | `genflow-backend-api` | El admin crea/edita/pausa flujos y el cliente los ve en su portal |
| Portal con datos reales (home, flows, billing) | `genflow-frontend` | KPIs, pipeline y costos salen de Supabase, con los tres estados |
| Prueba negativa de RLS por tabla | `genflow-qa` + `genflow-seguridad` | Cliente A no ve datos de B; automatizado en CI |

## Fase 2 — Motor de ejecuciones (la trazabilidad que vendemos)
**Meta:** que un flujo muestre ejecuciones reales, no demo.

| Feature | Owner | Criterio |
|---|---|---|
| `POST /api/v1/executions` firmado (HMAC) | `genflow-backend-api` | Webhook idempotente escribe `automation_logs` y actualiza `status` |
| Adaptador runtime (n8n/Make/agente) | `genflow-ai-automation` | Un flujo real reporta success/error al portal |
| Vista de ejecuciones + métrica por flujo | `genflow-frontend` + `genflow-ux-ui` | El cliente ve últimas corridas y el KPI que mueve el flujo |

## Fase 3 — Pulido UX/UI y accesibilidad
**Meta:** que entrar al portal comunique valor en 10 segundos.

- Rediseño de `/portal/home` (valor + alertas arriba del fold) — `genflow-ux-ui` / `genflow-frontend`.
- Dashboard con tendencia (sparklines, skill `dataviz`).
- Estados vacíos que enseñan; skeletons; feedback inmediato.
- Contraste AA, teclado, responsive mobile-first; `prefers-reduced-motion`.

## Fase 4 — Pagos y facturación real
**Meta:** cobrar la suscripción Genflow.

- Pasarela nacional **Wompi o ePayco** (Colombia) — `genflow-backend-api`.
- Webhook de confirmación idempotente + tabla `payment_events` — `genflow-seguridad`.
- Facturación del portal conectada a pagos reales + descarga CSV/recibo.

## Fase 5 — Producción, dominio y calidad
**Meta:** salir con una base estable y observable.

- Dominio Hostinger → Vercel (A `@` → `76.76.21.21`, CNAME `www`), SSL, redirect — `genflow-devops`.
- Variables en Vercel por entorno; Supabase Auth Site URL/Redirects al dominio.
- CSP report-only → enforce (probada vs three.js/framer/Supabase) — `genflow-seguridad`.
- Rate limiting en acciones públicas (`/diagnostico`) y webhooks — `genflow-seguridad`.
- Observabilidad: Vercel Analytics + Sentry; continuidad de Supabase — `genflow-devops`.
- QA E2E de flujos críticos (auth, aislamiento, tickets, billing) — `genflow-qa`.

## Fase 6 — Go-live
- Checklist pre-deploy completo (ver `docs/sprint-0.md` DoD).
- Smoke test con cliente piloto real.
- Monitoreo activo 72h post-lanzamiento.

---

## Nota sobre el plan Hobby de Vercel
Hobby es solo para uso **no comercial**. Para operar Genflow con clientes de pago,
subir a **Pro** antes de la Fase 4 (pagos) / Fase 6 (go-live).

---

## Cómo ejecutamos
Cada fase se abre con su sprint. El `genflow-product-owner` ordena el backlog, el
`genflow-scrum-master` facilita, y cada feature la implementa su owner. Arranque sugerido:
**Fase 1, historia 1** (service role key) para desbloquear invitaciones de cliente.
