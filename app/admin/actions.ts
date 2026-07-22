'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

type Result = { ok?: true; error?: string; message?: string };

/**
 * Toda acción de admin pasa por aquí primero. RLS ya bloquearía a un cliente,
 * pero la invitación usa service_role (que salta RLS), así que el chequeo de
 * rol tiene que ser explícito y ocurrir en el servidor.
 */
async function assertAdmin() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, error: 'Sesión expirada.' as const };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.role !== 'admin') {
    return { supabase, error: 'No tienes permisos de administrador.' as const };
  }

  return { supabase, error: null };
}

// ── Clientes ────────────────────────────────────────────────

export async function inviteClient(formData: FormData): Promise<Result> {
  const { error: authError } = await assertAdmin();
  if (authError) return { error: authError };

  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const name = String(formData.get('name') ?? '').trim();
  const company = String(formData.get('company') ?? '').trim();
  const plan = String(formData.get('plan') ?? 'Genflow Core');

  if (!email || !name) return { error: 'Nombre y correo son obligatorios.' };

  const admin = createAdminClient();
  if (!admin) {
    return {
      error:
        'Falta SUPABASE_SERVICE_ROLE_KEY en las variables de entorno. Sin ella no se pueden enviar invitaciones.',
    };
  }

  // El trigger on_auth_user_created lee esta metadata para crear el perfil.
  const { error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { name, company, plan, role: 'client' },
  });

  if (error) {
    return error.message.toLowerCase().includes('already')
      ? { error: 'Ese correo ya tiene una cuenta en el portal.' }
      : { error: error.message };
  }

  revalidatePath('/admin/clients');
  revalidatePath('/admin/dashboard');

  return { ok: true, message: `Invitación enviada a ${email}.` };
}

export async function updateClient(formData: FormData): Promise<Result> {
  const { supabase, error: authError } = await assertAdmin();
  if (authError) return { error: authError };

  const id = String(formData.get('id') ?? '');
  if (!id) return { error: 'Cliente no identificado.' };

  const status = String(formData.get('status') ?? '');
  const plan = String(formData.get('plan') ?? '').trim();
  const kpiRoi = String(formData.get('kpi_roi') ?? '').trim();
  const kpiLeads = Number(formData.get('kpi_leads') ?? 0);
  const kpiHours = Number(formData.get('kpi_hours') ?? 0);

  if (!['activo', 'onboarding', 'pausado'].includes(status)) {
    return { error: 'Estado inválido.' };
  }
  if (!Number.isFinite(kpiLeads) || !Number.isFinite(kpiHours)) {
    return { error: 'Los KPIs numéricos deben ser números.' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      status,
      plan: plan || 'Genflow Core',
      kpi_roi: kpiRoi || 'En proceso',
      kpi_leads: Math.max(0, Math.trunc(kpiLeads)),
      kpi_hours: Math.max(0, Math.trunc(kpiHours)),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/clients');
  revalidatePath('/admin/dashboard');

  return { ok: true, message: 'Cliente actualizado.' };
}

// ── Automatizaciones ────────────────────────────────────────

export async function assignAutomation(formData: FormData): Promise<Result> {
  const { supabase, error: authError } = await assertAdmin();
  if (authError) return { error: authError };

  const clientId = String(formData.get('client_id') ?? '');
  const name = String(formData.get('name') ?? '').trim();
  const stack = String(formData.get('stack') ?? '').trim();
  const area = String(formData.get('area') ?? 'operaciones');
  const monthlyCost = Number(formData.get('monthly_cost') ?? 0);
  const kpiResult = String(formData.get('kpi_result') ?? '').trim();
  const docUrl = String(formData.get('documentation_url') ?? '').trim();

  if (!clientId || !name) return { error: 'Cliente y nombre del flujo son obligatorios.' };
  if (!['marketing', 'ventas', 'operaciones', 'soporte'].includes(area)) {
    return { error: 'Área inválida.' };
  }
  if (!Number.isFinite(monthlyCost) || monthlyCost < 0) {
    return { error: 'El costo mensual debe ser un número positivo.' };
  }

  const { error } = await supabase.from('automations').insert({
    client_id: clientId,
    name,
    stack: stack || null,
    area,
    status: 'activo',
    monthly_cost: monthlyCost,
    kpi_result: kpiResult || null,
    documentation_url: docUrl || null,
  });

  if (error) return { error: error.message };

  revalidatePath('/admin/clients');
  revalidatePath('/admin/dashboard');
  revalidatePath('/portal/flows');

  return { ok: true, message: `Automatización "${name}" asignada.` };
}

// ── Tickets ─────────────────────────────────────────────────

export async function setTicketStatus(id: string, status: string): Promise<Result> {
  const { supabase, error: authError } = await assertAdmin();
  if (authError) return { error: authError };

  if (!['abierto', 'progreso', 'resuelto'].includes(status)) {
    return { error: 'Estado inválido.' };
  }

  const { error } = await supabase
    .from('support_tickets')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/tickets');
  revalidatePath('/portal/support');

  return { ok: true };
}

/**
 * Guarda la respuesta en el ticket, donde el cliente la ve en /portal/support.
 * No envía correo: eso requiere un proveedor de email todavía no configurado.
 */
export async function replyToTicket(formData: FormData): Promise<Result> {
  const { supabase, error: authError } = await assertAdmin();
  if (authError) return { error: authError };

  const id = String(formData.get('id') ?? '');
  const reply = String(formData.get('reply') ?? '').trim();

  if (!id) return { error: 'Ticket no identificado.' };
  if (!reply) return { error: 'La respuesta no puede estar vacía.' };

  const { error } = await supabase
    .from('support_tickets')
    .update({
      admin_reply: reply,
      replied_at: new Date().toISOString(),
      status: 'progreso',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/tickets');
  revalidatePath('/portal/support');

  return { ok: true, message: 'Respuesta publicada en el portal del cliente.' };
}
