'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

/**
 * Pausa o reanuda una automatización.
 *
 * El cliente sólo tiene política SELECT sobre `automations`, así que este
 * UPDATE únicamente prospera para un admin. Para un cliente, RLS devuelve
 * 0 filas y respondemos con el aviso de contactar al consultor — que es
 * el flujo de negocio correcto: los flujos los opera Genflow.
 */
export async function toggleAutomationStatus(id: string, current: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Sesión expirada. Vuelve a iniciar sesión.' };

  const next = current === 'pausa' ? 'activo' : 'pausa';

  const { data, error } = await supabase
    .from('automations')
    .update({ status: next, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id');

  if (error) return { error: error.message };

  if (!data || data.length === 0) {
    return {
      error:
        'Tu plan no permite pausar flujos directamente. Se notificó a tu consultor Genflow.',
    };
  }

  revalidatePath('/portal/flows');
  revalidatePath('/portal/home');

  return { ok: true, status: next };
}
