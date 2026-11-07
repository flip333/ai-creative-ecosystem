# Arquitectura de Genflow — guía para estudiar el código

Esta guía es el mapa mental del proyecto. Léela una vez de arriba a abajo; después,
cada vez que abras un archivo, vas a saber qué papel cumple y por qué está donde está.

---

## 1. Qué es, en una frase

Una app **Next.js 15 + Supabase** con **tres superficies** sobre un mismo código:

| Superficie | Ruta | Quién entra | Para qué |
|---|---|---|---|
| **Landing** | `/`, `/soluciones`, `/diagnostico`… | cualquiera (público) | vender y captar leads |
| **Portal** | `/portal/*` | cliente (invite-only) | ver sus flujos, KPIs, costos y soporte |
| **CRM / Oficina** | `/admin/*` | admin (Genflow) | operar todo el ecosistema |

Comparten `components/ui`, `lib/` y los tokens de diseño, pero **no comparten permisos ni datos**.

---

## 2. El stack y por qué

- **Next.js 15 (App Router)** — un solo proyecto hace frontend y backend.
  - **Server Components** por defecto: la página corre en el servidor, trae los datos y manda HTML. Menos JavaScript al navegador.
  - **Server Actions** (`'use server'`): funciones que corren en el servidor y mutan datos sin necesidad de una API REST.
  - `'use client'` solo donde hay interacción real (un modal, un formulario, un hover).
- **Supabase** — es Postgres + Auth + reglas de seguridad en la base.
  - **Auth** invite-only (nadie se registra solo; el admin invita).
  - **RLS** (Row Level Security): la base decide, fila por fila, quién puede ver qué.
- **Tailwind 4** para estilos, **Framer Motion** para animación, **Vercel** para desplegar.

---

## 3. Mapa de carpetas

```
app/
  (marketing)/      → landing pública (grupo de rutas con su propio layout)
  login/            → acceso; actions.ts hace el signIn
  portal/           → portal del cliente
    layout.tsx      → chrome del portal (sidebar + header), exige sesión
    home, flows, docs, billing, support/  → una carpeta por pantalla
    loading.tsx     → skeleton mientras cargan los datos (estado de CARGA)
    error.tsx       → pantalla recuperable si una query falla (estado de ERROR)
  admin/            → CRM / Oficina Virtual
    layout.tsx      → chrome admin, exige role=admin
    actions.ts      → TODAS las mutaciones del admin (server actions)
    oficina, dashboard, clients, flows, leads, billing, tickets, equipo/
components/
  portal/  admin/  → vistas cliente (interactivas) de cada superficie
  sections/        → bloques de la landing
  ui/              → piezas reutilizables (button…)
lib/
  supabase/        → los tres clientes de Supabase (ver §6)
  queries.ts       → TODAS las lecturas de datos + los guardianes de sesión
  types.ts         → los tipos TypeScript del dominio
  schema.sql       → la base de datos entera (idempotente)
  format.ts        → helpers de formato (fechas, dinero, iniciales)
middleware.ts      → primera barrera de seguridad, corre en cada request
.claude/agents/    → el Crew IA (equipo de subagentes, ver §10)
docs/              → esta guía, el plan de lanzamiento, el sprint 0
```

**Patrón que se repite:** `app/<ruta>/page.tsx` es un **Server Component** que (1) exige
sesión, (2) llama a una función de `lib/queries.ts` para traer datos, y (3) se los pasa a
un **Client Component** de `components/` que pinta la UI interactiva.

---

## 4. El flujo de una request (de la URL al dato)

Cuando alguien abre `/portal/flows`:

1. **`middleware.ts`** intercepta la request *antes* que nada. Refresca la sesión y, si no
   hay usuario, redirige a `/login`. (Primera capa de seguridad.)
2. **`app/portal/layout.tsx`** corre en el servidor, llama a `requireProfile()` — si la
   cookie falló y el middleware no cortó, aquí se corta. (Segunda capa.)
3. **`app/portal/flows/page.tsx`** (Server Component) llama a `getAutomations(userId)`.
4. `getAutomations` usa el **cliente servidor de Supabase** y hace el `select`. Postgres
   aplica **RLS**: aunque el código pidiera todo, la base solo devuelve las filas del
   cliente. (Tercera capa.)
5. La página pasa los datos a **`FlowsView`** (`'use client'`), que pinta la UI.
6. Si el usuario abre un flujo en error y crea un ticket, eso dispara una **Server Action**
   que escribe en Supabase y revalida la ruta.

Ese es el ciclo completo: **middleware → layout/guard → page (lee) → view (pinta) → action (muta)**.

---

## 5. Las tres capas de seguridad (lo más importante)

Son independientes: cada una basta por sí sola, y están puestas por si una falla.

1. **Middleware** (`lib/supabase/middleware.ts`) — sin sesión → `/login`; no-admin fuera de `/admin`. Es *conveniencia*, redirige rápido.
2. **Guardianes de servidor** (`lib/queries.ts`) — `requireProfile()` y `requireAdmin()` cortan la request dentro de la página aunque el middleware no corriera.
3. **RLS en Postgres** (`lib/schema.sql`) — la **garantía real**. Un cliente solo ve filas con `client_id = auth.uid()`. Ni un bug del frontend expone datos de otro.

**El truco de `is_admin()`:** una política sobre `profiles` que consultara `profiles` se
evaluaría a sí misma y Postgres aborta con recursión (`42P17`). Por eso existe la función
`is_admin()` marcada `SECURITY DEFINER`: corre como dueño, salta RLS y rompe el ciclo. No la
"simplifiques" quitando eso.

**Regla de oro:** el middleware y los guards son redes; **RLS es el piso**. Toda tabla nueva
nace con RLS y su política por cliente, y se prueba intentando leer datos de otro (debe fallar).

---

## 6. Los tres clientes de Supabase (y cuándo usar cada uno)

`lib/supabase/` tiene tres fábricas, una por contexto de ejecución:

| Archivo | Se usa en | Llave | Qué puede |
|---|---|---|---|
| `client.ts` | Client Components (navegador) | anon | solo lo que RLS permita al usuario |
| `server.ts` | Server Components / Actions | anon + cookie | lo del usuario logueado (cookie) |
| `admin.ts` | server actions de admin **ya verificadas** | service_role | **salta RLS** — poder total |

El `admin.ts` es el único peligroso: salta RLS, así que **solo** se llama después de
confirmar `role === 'admin'` (eso hace `assertAdmin()` en `app/admin/actions.ts`). Su llave
(`SUPABASE_SERVICE_ROLE_KEY`) vive solo en el servidor, jamás en `NEXT_PUBLIC_`.

---

## 7. Server Component vs Client Component vs Server Action

- **Server Component** (la mayoría de `page.tsx`): corre en el servidor, puede ser `async`,
  lee datos directo de Supabase. No tiene estado ni `onClick`.
- **Client Component** (`'use client'`, casi todo en `components/`): corre en el navegador,
  tiene `useState`, `onClick`, modales. Recibe los datos ya cargados por props.
- **Server Action** (`'use server'`, en `actions.ts`): una función que el formulario llama;
  corre en el servidor, valida, muta Supabase y hace `revalidatePath` para refrescar.

Regla práctica: **lee en el Server Component, pinta en el Client Component, muta con una Action.**

---

## 8. El modelo de datos (`lib/schema.sql`)

```
auth.users (Supabase)
   │ 1:1 (trigger on_auth_user_created)
profiles ──1:N── automations ──1:N── automation_logs
   │                   └── master_prompt (prompt que ve el cliente en Docs)
   ├──1:N── billing_records
   └──1:N── support_tickets
diagnostics  (leads del formulario público; no cuelgan de un cliente)
```

- `profiles` extiende a `auth.users` (guarda role, company, KPIs). Se crea sola con un
  **trigger** al invitar un usuario.
- `automations` = los flujos de un cliente; `automation_logs` = sus ejecuciones (success/error).
- `diagnostics` = la única tabla donde escribe un visitante anónimo (el formulario `/diagnostico`),
  pero nadie anónimo puede leerla.

---

## 9. Cómo fluye un dato real (ejemplo completo)

**El admin crea un flujo y el cliente lo ve:**

1. Admin abre `/admin/clients`, abre un cliente, "Asignar flujo" → formulario.
2. El submit llama a la Server Action `assignAutomation` (`app/admin/actions.ts`).
3. La action hace `assertAdmin()`, valida, e inserta en `automations` con el cliente servidor.
4. `revalidatePath('/portal/flows')` marca esa ruta como vieja.
5. Cuando el cliente entra a `/portal/flows`, `getAutomations(userId)` trae el flujo nuevo —
   y RLS garantiza que solo ve los suyos.

Lo mismo para editar/pausar/eliminar (`FlowsManager` + `updateAutomation`/`setAutomationStatus`/
`deleteAutomation`), responder tickets, o editar el prompt maestro que aparece en `/portal/docs`.

---

## 10. El Crew IA (`.claude/agents/`)

Un equipo de 11 **subagentes de Claude Code** (PO, Scrum Master, Arquitecto, Seguridad,
DevOps, AI/Automation, Backend, Frontend, UX/UI, QA, Delivery/CRM). **No corren dentro de la
app desplegada**: viven en el entorno de desarrollo y se invocan por nombre
(`usa genflow-<rol>…`). La pestaña `/admin/oficina` los muestra como tablero de mando.
El plan de trabajo está en `docs/launch-plan.md` y `docs/sprint-0.md`.

---

## 11. Por dónde empezar a leer el código

En este orden, siguiendo una request real:

1. `middleware.ts` → `lib/supabase/middleware.ts` — la puerta de entrada.
2. `lib/queries.ts` — `requireProfile`/`requireAdmin` y las lecturas.
3. `app/portal/flows/page.tsx` → `components/portal/FlowsView.tsx` — page lee, view pinta.
4. `app/admin/actions.ts` — cómo se mutan los datos (las Server Actions).
5. `lib/schema.sql` — la base y las políticas RLS (el final del archivo).

Con esos cinco entiendes el 80% del sistema. El resto son variaciones del mismo patrón.
