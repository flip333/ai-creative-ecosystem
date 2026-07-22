import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type {
  Automation,
  AutomationWithLogs,
  BillingRecord,
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
