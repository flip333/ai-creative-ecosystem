#!/usr/bin/env node
/**
 * Prueba negativa de aislamiento multi-tenant (RLS) - Genflow
 *
 * Demuestra que un cliente autenticado NO puede leer filas de otro cliente.
 * Usa solo la anon key + password grant (nunca service role).
 *
 * Uso:
 *   node scripts/rls-negative-test.mjs
 *
 * Variables opcionales (para apuntar a otro entorno):
 *   SUPABASE_URL, SUPABASE_ANON_KEY, RLS_PASS_A, RLS_PASS_B
 *
 * Precondicion: existen los usuarios de prueba rls-test-a/b@genflow.test con
 * datos sembrados (ver scripts/README.md). Se DEJAN creados a proposito para
 * poder re-ejecutar la prueba en CI; son clientes sin privilegios.
 *
 * Salida: PASS/FAIL por tabla y direccion (A->B y B->A). Exit code 1 si falla algo.
 */

const URL_BASE = process.env.SUPABASE_URL ?? 'https://qrgrzbkjngbgvbzesvaf.supabase.co'
const ANON =
  process.env.SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ3J6YmtqbmdiZ3ZiemVzdmFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0MTc3NDMsImV4cCI6MjEwNjk5Mzc0M30.HUIC1-FamvkH7BnSE5W7bvqXDCI-4fcKCiShwMBHCe8'

const USERS = {
  A: { email: 'rls-test-a@genflow.test', password: process.env.RLS_PASS_A ?? 'RlsTest-A-2026!' },
  B: { email: 'rls-test-b@genflow.test', password: process.env.RLS_PASS_B ?? 'RlsTest-B-2026!' },
}

// tabla -> columna de propietario (automation_logs no tiene client_id: se liga via automations)
const TABLES = [
  { name: 'profiles', owner: 'id' },
  { name: 'automations', owner: 'client_id' },
  { name: 'automation_logs', owner: null },
  { name: 'billing_records', owner: 'client_id' },
  { name: 'support_tickets', owner: 'client_id' },
  { name: 'office_agents', owner: 'client_id' },
]

async function login({ email, password }) {
  const res = await fetch(`${URL_BASE}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: ANON, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const body = await res.json()
  if (!res.ok || !body.access_token) {
    throw new Error(`Login fallido para ${email}: ${res.status} ${JSON.stringify(body)}`)
  }
  return { token: body.access_token, id: body.user.id }
}

async function rest(token, path) {
  const res = await fetch(`${URL_BASE}/rest/v1/${path}`, {
    headers: { apikey: ANON, Authorization: `Bearer ${token}` },
  })
  const body = await res.json()
  if (!res.ok) throw new Error(`REST ${path} -> ${res.status} ${JSON.stringify(body)}`)
  return body
}

async function checkDirection(me, other, label) {
  const results = []
  // ids de automations de cada uno, para validar automation_logs
  const myAutos = (await rest(me.token, 'automations?select=id')).map((r) => r.id)
  const otherAutos = (await rest(other.token, 'automations?select=id')).map((r) => r.id)

  for (const t of TABLES) {
    const problems = []
    const rows = await rest(me.token, `${t.name}?select=*`)
    if (rows.length === 0) problems.push('sin filas propias (la siembra debe dar >=1)')

    if (t.owner) {
      const foreign = rows.filter((r) => r[t.owner] !== me.id)
      if (foreign.length) problems.push(`${foreign.length} fila(s) ajena(s) visibles`)
      const leak = await rest(me.token, `${t.name}?select=*&${t.owner}=eq.${other.id}`)
      if (leak.length) problems.push(`filtrar por id ajeno devolvio ${leak.length} fila(s)`)
    } else {
      const foreign = rows.filter((r) => !myAutos.includes(r.automation_id))
      if (foreign.length) problems.push(`${foreign.length} log(s) ajeno(s) visibles`)
      for (const aid of otherAutos) {
        const leak = await rest(me.token, `${t.name}?select=*&automation_id=eq.${aid}`)
        if (leak.length) problems.push(`filtrar por automation ajena devolvio ${leak.length} fila(s)`)
      }
    }
    results.push({ dir: label, table: t.name, rows: rows.length, ok: problems.length === 0, problems })
  }
  return results
}

async function main() {
  const A = { ...(await login(USERS.A)) }
  const B = { ...(await login(USERS.B)) }
  const results = [
    ...(await checkDirection(A, B, 'A->B')),
    ...(await checkDirection(B, A, 'B->A')),
  ]

  console.log('\nRLS negative test - aislamiento entre clientes\n')
  for (const r of results) {
    const tag = r.ok ? 'PASS' : 'FAIL'
    const extra = r.ok ? `(${r.rows} fila(s) propias, 0 ajenas)` : `- ${r.problems.join('; ')}`
    console.log(`${tag}  [${r.dir}] ${r.table.padEnd(16)} ${extra}`)
  }
  const failed = results.filter((r) => !r.ok).length
  console.log(`\n${failed === 0 ? 'RESULTADO: PASS' : `RESULTADO: FAIL (${failed} fallos)`} - ${results.length} comprobaciones`)
  process.exit(failed === 0 ? 0 : 1)
}

main().catch((e) => {
  console.error('ERROR:', e.message)
  process.exit(2)
})
