/**
 * POST /api/v1/executions  — webhook firmado que registra ejecuciones reales.
 *
 * Body JSON: { automation_id: uuid, status: 'success'|'error', message?: string, external_id?: string }
 * Header:    x-genflow-signature = HMAC-SHA256 hex del cuerpo CRUDO con GENFLOW_WEBHOOK_SECRET.
 *
 * Variables de entorno necesarias (ambas, server-only):
 *   - GENFLOW_WEBHOOK_SECRET      secreto compartido para firmar (sin el: 503)
 *   - SUPABASE_SERVICE_ROLE_KEY   para escribir saltando RLS (sin ella: 503)
 *
 * Ejemplo de firma (node):
 *   const crypto = require('crypto');
 *   const body = JSON.stringify({ automation_id: '<uuid>', status: 'success', message: 'ok', external_id: 'run-123' });
 *   const sig = crypto.createHmac('sha256', process.env.GENFLOW_WEBHOOK_SECRET).update(body).digest('hex');
 *   await fetch('https://<host>/api/v1/executions', {
 *     method: 'POST',
 *     headers: { 'content-type': 'application/json', 'x-genflow-signature': sig },
 *     body, // enviar EXACTAMENTE la misma cadena firmada
 *   });
 *
 * Respuestas: 201 creado | 200 idempotente (external_id ya registrado) | 400 body invalido |
 *             401 firma invalida/ausente | 404 automatizacion inexistente | 503 config pendiente.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type ExecutionBody = {
  automation_id: string;
  status: 'success' | 'error';
  message?: string;
  external_id?: string;
};

function parseBody(v: unknown): ExecutionBody | null {
  if (!v || typeof v !== 'object') return null;
  const o = v as Record<string, unknown>;
  if (typeof o.automation_id !== 'string' || !UUID_RE.test(o.automation_id)) return null;
  if (o.status !== 'success' && o.status !== 'error') return null;
  if (o.message !== undefined && (typeof o.message !== 'string' || o.message.length > 2000)) return null;
  if (
    o.external_id !== undefined &&
    (typeof o.external_id !== 'string' || o.external_id.length < 1 || o.external_id.length > 200)
  ) return null;
  return {
    automation_id: o.automation_id,
    status: o.status,
    message: o.message as string | undefined,
    external_id: o.external_id as string | undefined,
  };
}

function validSignature(raw: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const expected = createHmac('sha256', secret).update(raw).digest();
  const given = Buffer.from(header.trim(), 'hex');
  if (given.length !== expected.length) return false;
  return timingSafeEqual(given, expected);
}

export async function POST(req: Request) {
  const secret = process.env.GENFLOW_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'config pendiente (GENFLOW_WEBHOOK_SECRET)' }, { status: 503 });
  }

  const raw = await req.text();
  if (!validSignature(raw, req.headers.get('x-genflow-signature'), secret)) {
    return NextResponse.json({ error: 'firma invalida' }, { status: 401 });
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'JSON invalido' }, { status: 400 });
  }
  const body = parseBody(json);
  if (!body) return NextResponse.json({ error: 'body invalido' }, { status: 400 });
  const { automation_id, status, message, external_id } = body;

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ error: 'falta service role key (SUPABASE_SERVICE_ROLE_KEY)' }, { status: 503 });
  }

  const { data: automation, error: findErr } = await admin
    .from('automations')
    .select('id')
    .eq('id', automation_id)
    .maybeSingle();
  if (findErr) return NextResponse.json({ error: 'error de base de datos' }, { status: 500 });
  if (!automation) return NextResponse.json({ error: 'automatizacion no encontrada' }, { status: 404 });

  const { error: insErr } = await admin.from('automation_logs').insert({
    automation_id,
    status,
    message: message ?? null,
    external_id: external_id ?? null,
  });
  if (insErr) {
    // 23505 = unique_violation: external_id ya registrado -> idempotente.
    if (insErr.code === '23505' && external_id) {
      return NextResponse.json({ ok: true, duplicate: true }, { status: 200 });
    }
    return NextResponse.json({ error: 'no se pudo registrar la ejecucion' }, { status: 500 });
  }

  const { error: updErr } = await admin
    .from('automations')
    .update({ status: status === 'success' ? 'activo' : 'error', updated_at: new Date().toISOString() })
    .eq('id', automation_id);
  if (updErr) {
    return NextResponse.json({ ok: true, warning: 'log registrado, estado no actualizado' }, { status: 201 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
