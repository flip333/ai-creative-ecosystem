import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// ============================================================
// Estado en vivo del Crew para la oficina animada (public/oficina-crew).
// GET  → JSON en el formato que espera el motor del kit, derivado de crew_state.
// POST → "puente": un admin actualiza el estado de un agente (y la oficina lo
//        refleja en <= 2 s). Body: { agent, estado, tarea?, accion?, dice?, reunion? }.
// ============================================================

type AgentJson = {
  estado: string;
  tarea?: string;
  accion: string;
  t: number;
  dice?: string;
  dice_t?: number;
};

const epoch = (iso: string | null): number =>
  iso ? new Date(iso).getTime() / 1000 : Date.now() / 1000;

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('crew_state').select('*');

  if (error) {
    return NextResponse.json(
      { agentes: {}, reunion: null, corriendo: true, pid: 1, error: error.message },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const agentes: Record<string, AgentJson> = {};
  for (const r of data ?? []) {
    const t = epoch(r.updated_at);
    const a: AgentJson = {
      estado: r.estado,
      accion: r.accion ?? 'listo',
      t,
    };
    if (r.tarea) a.tarea = r.tarea;
    if (r.dice) { a.dice = r.dice; a.dice_t = epoch(r.dice_t); }
    agentes[r.agent] = a;
  }

  // `reunion` se guarda en una fila especial '__reunion__' (tarea = texto, o null).
  const reunionRow = (data ?? []).find((r) => r.agent === '__reunion__');
  const reunion = reunionRow?.tarea ?? null;
  // No mostramos la fila de control como agente.
  delete agentes['__reunion__'];

  return NextResponse.json(
    { agentes, reunion, corriendo: true, pid: 1 },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

export async function POST(req: Request) {
  const supabase = await createClient();

  // Guard de admin (la escritura también la protege RLS, pero cortamos antes).
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Sesión requerida.' }, { status: 401 });
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Solo admin.' }, { status: 403 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'JSON inválido.' }, { status: 400 }); }

  // Controlar la reunión: { reunion: "texto" | null }
  if ('reunion' in body && !('agent' in body)) {
    const texto = body.reunion == null ? null : String(body.reunion);
    const { error } = await supabase.from('crew_state').upsert({ agent: '__reunion__', estado: 'libre', tarea: texto }, { onConflict: 'agent' });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true, reunion: texto });
  }

  const agent = String(body.agent ?? '').trim();
  if (!agent) return NextResponse.json({ error: 'Falta "agent".' }, { status: 400 });
  const estado = String(body.estado ?? 'libre');
  if (!['trabajando', 'listo', 'libre'].includes(estado)) {
    return NextResponse.json({ error: 'estado inválido.' }, { status: 400 });
  }

  const row: Record<string, unknown> = {
    agent,
    estado,
    tarea: body.tarea != null ? String(body.tarea) : null,
    accion: body.accion != null ? String(body.accion) : (estado === 'libre' ? 'disponible' : 'listo'),
  };
  if (body.dice != null) { row.dice = String(body.dice); row.dice_t = new Date().toISOString(); }

  const { error } = await supabase.from('crew_state').upsert(row, { onConflict: 'agent' });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, agent, estado });
}
