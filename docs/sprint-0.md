# Sprint 0 — Cimiento: Blindaje y Contratos

> **Objetivo del sprint:** cerrar la deuda de seguridad y dejar los contratos de datos
> listos **antes** de construir valor encima. Un cliente ve datos sensibles de su
> operación; el aislamiento no es negociable.
>
> **Duración:** 2 semanas · **Sprint goal:** *"Ningún cliente puede ver datos de otro, y desplegar es seguro y repetible."*

---

## Tablero del sprint

| # | Historia | Rol dueño | Criterio de aceptación | Estado |
|---|---|---|---|---|
| S0-1 | Headers de seguridad en toda ruta | `genflow-seguridad` | HSTS, nosniff, frame, referrer y permissions presentes en la respuesta de producción | ✅ Hecho (`next.config.ts`) |
| S0-2 | Apagar source maps y `x-powered-by` | `genflow-devops` | `productionBrowserSourceMaps:false`, `poweredByHeader:false` | ✅ Hecho |
| S0-3 | CSP con nonce probada contra three.js/framer/Supabase | `genflow-seguridad` | CSP sin `unsafe-inline` que no rompa landing ni portal; verificada en preview | ⬜ Pendiente |
| S0-4 | Prueba negativa de RLS por tabla | `genflow-qa` + `genflow-seguridad` | Test que intenta leer filas de otro `client_id` y **falla**, en cada tabla con datos de cliente | ⬜ Pendiente |
| S0-5 | Contrato de ingreso de ejecuciones | `genflow-backend-api` + `genflow-arquitecto` | Endpoint `POST /api/v1/executions` firmado (HMAC) que escribe en `automation_logs` e idempotente | ⬜ Pendiente |
| S0-6 | Rate limiting en Server Actions y webhooks | `genflow-seguridad` | Límite por IP (Upstash + Vercel KV) en acciones públicas (`/diagnostico`) y el webhook | ⬜ Pendiente |
| S0-7 | Auditoría de secretos y del service-role client | `genflow-seguridad` | `admin.ts` jamás importado desde un Client Component; nada sensible en `NEXT_PUBLIC_`; `.env.example` al día | ⬜ Pendiente |
| S0-8 | Continuidad de Supabase | `genflow-devops` | Monitor que evita la pausa por inactividad (+90 días); runbook de recuperación documentado | ⬜ Pendiente |
| S0-9 | CI como gate de merge | `genflow-devops` + `genflow-qa` | `build` + `typecheck` (+ pruebas de RLS cuando existan) obligatorios antes de merge | ⬜ Pendiente |

---

## Detalle por historia

### S0-3 · CSP con nonce (pendiente, requiere pruebas)
La landing usa three.js (crea blobs/workers), framer-motion (estilos inline) y Google Fonts; el portal abre conexiones a Supabase. Una CSP a ciegas rompe todo esto. Plan:
1. Empezar en modo `Content-Security-Policy-Report-Only` para observar violaciones sin romper.
2. Permitir explícitamente: `fonts.googleapis.com`/`fonts.gstatic.com`, el dominio de Supabase (`connect-src`), `'self'` para scripts con nonce.
3. Pasar a enforce solo cuando el reporte quede limpio en preview.

### S0-4 · Prueba negativa de RLS (la más importante)
Por cada tabla con `client_id` (`automations`, `automation_logs`, `billing_records`, `support_tickets`): autenticarse como cliente A e intentar `select` de filas de cliente B → debe devolver **0 filas**. Automatizar en CI. Es la garantía de que el aislamiento multi-tenant funciona de verdad, no solo en teoría.

### S0-5 · Contrato de ejecuciones (desacople del runtime)
El portal nunca habla con n8n/Make directo. El runtime externo hace `POST /api/v1/executions` con firma HMAC y `{ automation_id, status, message }`; el endpoint valida firma, es idempotente (mismo evento puede llegar dos veces) y escribe `automation_logs` + actualiza `automations.status`. Cambiar de runtime no toca el portal.

---

## Definition of Done (compartida)

- [ ] Tipos estrictos, sin `any`; `npm run build` pasa.
- [ ] RLS habilitado y con prueba negativa en toda tabla tocada.
- [ ] Validación de inputs en servidor (Zod) en toda Server Action / endpoint.
- [ ] Sin secretos en `NEXT_PUBLIC_`; `.env.example` documentado.
- [ ] Accesible (AA, teclado) y responsive; probado en la preview real.

---

## Cómo arranca el equipo

Invoca a cada rol por su historia. Ejemplo:

```
usa genflow-seguridad para implementar S0-3 (CSP report-only) y S0-4 (prueba negativa de RLS)
usa genflow-backend-api para construir S0-5 (POST /api/v1/executions firmado)
usa genflow-devops para montar S0-9 (CI gate) y S0-8 (continuidad de Supabase)
```

El `genflow-scrum-master` facilita; el `genflow-product-owner` acepta cada historia contra su criterio en el review.
