# Genflow — Ecosistema + Portal de Clientes

Landing pública de Genflow más el portal privado de clientes (`/portal`) y el
mini-CRM de administración (`/admin`), sobre Next.js 15 (App Router) y Supabase.

## Stack

- **Next.js 15** — App Router, Server Components, Server Actions
- **Supabase** — Auth (invite-only) + Postgres con Row Level Security
- **Tailwind CSS 4**, **Framer Motion**, **lucide-react**

## Rutas

| Ruta | Acceso | Descripción |
|---|---|---|
| `/`, `/soluciones`, `/beneficios`, `/metodologia`, `/diagnostico` | público | Landing |
| `/login` | público | Acceso invite-only |
| `/portal/home` | cliente | KPIs y alertas derivadas del estado real de los flujos |
| `/portal/flows` | cliente | Automatizaciones + drawer con pipeline y últimas ejecuciones |
| `/portal/docs` | cliente | Prompts maestros |
| `/portal/billing` | cliente | Desglose de costos y descarga en CSV |
| `/portal/support` | cliente | Tickets 1:1 con el consultor |
| `/admin/dashboard` | admin | Métricas globales del ecosistema |
| `/admin/clients` | admin | CRM: invitar, editar métricas, asignar flujos |
| `/admin/tickets` | admin | Bandeja de soporte |

## Puesta en marcha

### 1. Variables de entorno

Crea `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>
```

`SUPABASE_SERVICE_ROLE_KEY` sólo se usa en el servidor, para invitar clientes vía
la Admin API de Auth. Nunca se expone al navegador. Sin ella la app funciona,
pero el botón de invitar clientes devuelve un error explicando que falta.

Las mismas tres variables deben existir en Vercel (Production, Preview y
Development).

### 2. Base de datos

Ejecuta `lib/schema.sql` en el SQL Editor de Supabase. El script es idempotente:
se puede re-ejecutar sin romper nada.

Luego marca tu usuario como administrador:

```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'tu@correo.com';
```

Opcionalmente, `lib/seed.sql` carga datos demo (flujos, logs, costos y tickets)
para un cliente. Edita el correo al inicio del archivo antes de ejecutarlo.

### 3. Desarrollo

```bash
npm install
npm run dev
```

## Modelo de seguridad

Tres capas, cada una independiente de las otras:

1. **Middleware** (`middleware.ts`) — redirige a `/login` sin sesión y saca de
   `/admin` a quien no sea admin.
2. **Server Components** — `requireProfile()` / `requireAdmin()` en `lib/queries.ts`
   cortan la request aunque el middleware no se haya ejecutado.
3. **Row Level Security** — la última palabra la tiene Postgres: un cliente sólo
   ve las filas cuyo `client_id` es su propio `auth.uid()`.

Detalle relevante: la política de admin sobre `profiles` **no** puede consultar
`profiles` directamente — Postgres detecta la recursión y aborta con
`42P17 infinite recursion detected in policy`. Por eso existe `public.is_admin()`,
una función `SECURITY DEFINER` con `search_path` fijo que rompe el ciclo.

Los clientes pueden crear tickets pero no cambiarles el estado: sobre
`support_tickets` sólo tienen políticas `SELECT` e `INSERT`, no `UPDATE`.

## Despliegue

Ver [deployment_guide.md](deployment_guide.md).
