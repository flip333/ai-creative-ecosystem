# scripts/

## rls-negative-test.mjs

Prueba negativa de aislamiento multi-tenant. Inicia sesion como el cliente A y
el cliente B (anon key + password grant, sin service role) y verifica, en ambas
direcciones, que en `profiles`, `automations`, `automation_logs`,
`billing_records`, `support_tickets` y `office_agents`:

- el SELECT completo solo devuelve filas propias;
- filtrar por el id del otro cliente (`?client_id=eq.<otro>`, o por
  `automation_id` ajeno en `automation_logs`) devuelve `[]`.

Correr (Node 18+):

    node scripts/rls-negative-test.mjs

Exit code 0 = todo PASS; 1 = fuga de aislamiento; 2 = error de login/red.
Variables opcionales: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `RLS_PASS_A`, `RLS_PASS_B`.

### Datos de prueba (proyecto `qrgrzbkjngbgvbzesvaf`)

Usuarios `rls-test-a@genflow.test` y `rls-test-b@genflow.test` (role `client`),
con UUID fijos `aaaaaaaa-0000-4000-8000-00000000a001` y
`bbbbbbbb-0000-4000-8000-00000000b001`, y una fila por tabla cada uno. Se dejan
creados para re-ejecutar la prueba (CI). Para recrearlos en otro proyecto: insertar
en `auth.users` (con `extensions.crypt(pass, extensions.gen_salt('bf'))` y los
campos de token en `''`, si no GoTrue da 500), `auth.identities`, `profiles` y
sembrar una fila por tabla. Para borrarlos: `delete from auth.users where email like 'rls-test-%@genflow.test'`
(borrar antes las filas hijas de cada tabla).
