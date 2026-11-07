import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type {
  Automation,
  AutomationWithClient,
  AutomationWithLogs,
  BillingRecord,
  Diagnostic,
  ExecutionTrendPoint,
  Profile,
  SupportTicket,
  TicketWithClient,
} from '@/lib/types';

/**
 * Usuario autenticado + su perfil. El middleware ya bloquea anónimos,
 * pero las páginas no deben confiar en eso: un fallo de cookie deja
 * pasar la request y aquí es donde se corta.
 */
export async function requireProfile(): Promise<{ userId: string; profile: Profile }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) {
    // Usuario existe en Auth pero el trigger no creó el perfil.
    redirect('/login?error=Tu perfil no está configurado. Contacta a tu consultor Genflow.');
  }

  return { userId: user.id, profile: profile as Profile };
}

export async function requireAdmin(): Promise<{ userId: string; profile: Profile }> {
  const session = await requireProfile();
  if (session.profile.role !== 'admin') redirect('/portal/home');
  return session;
}

// ── Portal del cliente ──────────────────────────────────────

export async function getAutomations(clientId: string): Promise<AutomationWithLogs[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('automations')
    .select('*, automation_logs(*)')
    .eq('client_id', clientId)
    .order('created_at', { ascending: true });

  // Postgrest no ordena ni limita relaciones embebidas de forma fiable,
  // así que recortamos a las 5 ejecuciones más recientes aquí.
  return (data ?? []).map((row) => ({
    ...row,
    nodes: Array.isArray(row.nodes) ? row.nodes : [],
    automation_logs: (row.automation_logs ?? [])
      .sort((a: { created_at: string }, b: { created_at: string }) =>
        b.created_at.localeCompare(a.created_at))
      .slice(0, 5),
  })) as AutomationWithLogs[];
}

/**
 * Ejecuciones por día de los flujos del cliente (automation_logs), últimos
 * `days` días incluyendo hoy. Siempre devuelve `days` puntos (con ceros).
 */
export async function getExecutionTrend(
  clientId: string,
  days = 14,
): Promise<ExecutionTrendPoint[]> {
  const supabase = await createClient();

  const keyOf = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));

  const buckets = new Map<string, ExecutionTrendPoint>();
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const day = keyOf(d);
    buckets.set(day, { day, success: 0, error: 0 });
  }

  const { data } = await supabase
    .from('automation_logs')
    .select('status, created_at, automations!inner(client_id)')
    .eq('automations.client_id', clientId)
    .gte('created_at', start.toISOString())
    .limit(5000);

  for (const row of (data ?? []) as { status: string; created_at: string }[]) {
    const bucket = buckets.get(keyOf(new Date(row.created_at)));
    if (!bucket) continue;
    if (row.status === 'error') bucket.error += 1;
    else bucket.success += 1;
  }

  return Array.from(buckets.values());
}

export async function getBillingRecords(clientId: string): Promise<BillingRecord[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('billing_records')
    .select('*')
    .eq('client_id', clientId)
    .order('monthly_cost', { ascending: false });

  return (data ?? []) as BillingRecord[];
}

export async function getTickets(clientId: string): Promise<SupportTicket[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('support_tickets')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  return (data ?? []) as SupportTicket[];
}

// ── Admin / CRM ─────────────────────────────────────────────

export async function getClients(): Promise<Profile[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'client')
    .order('created_at', { ascending: false });

  return (data ?? []) as Profile[];
}

export async function getAllAutomations(): Promise<Automation[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('automations')
    .select('id, client_id, name, status, monthly_cost, updated_at');

  return (data ?? []) as Automation[];
}

export async function getAllTickets(): Promise<TicketWithClient[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('support_tickets')
    .select('*, profiles(name, company, email, avatar_initials)')
    .order('created_at', { ascending: false });

  return (data ?? []) as TicketWithClient[];
}

export async function getAllBillingRecords(): Promise<BillingRecord[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('billing_records')
    .select('id, client_id, service_name, service_type, monthly_cost, billing_month');

  return (data ?? []) as BillingRecord[];
}

/** Flujos de todo el ecosistema con el cliente dueño, para la Oficina Virtual. */
export async function getAllAutomationsWithClient(): Promise<AutomationWithClient[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('automations')
    .select(
      'id, client_id, name, stack, area, status, monthly_cost, kpi_result, master_prompt, updated_at, profiles(name, company, avatar_initials)',
    )
    .order('updated_at', { ascending: false });

  return (data ?? []).map((row) => ({
    ...row,
    nodes: [],
  })) as unknown as AutomationWithClient[];
}

/** Leads de la landing (tabla `diagnostics`). Solo visibles para admin vía RLS. */
export async function getDiagnostics(): Promise<Diagnostic[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('diagnostics')
    .select('*')
    .order('created_at', { ascending: false });

  return (data ?? []) as Diagnostic[];
}
