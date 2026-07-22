'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

const PRIORITIES = ['Baja', 'Media', 'Alta'] as const;

export async function createTicket(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Sesión expirada. Vuelve a iniciar sesión.' };

  const subject = String(formData.get('subject') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();
  const rawPriority = String(formData.get('priority') ?? 'Media');

  if (!subject) return { error: 'El asunto es obligatorio.' };
  if (subject.length > 200) return { error: 'El asunto no puede superar 200 caracteres.' };

  // No confiamos en el <select>: el CHECK de Postgres rechazaría un valor
  // arbitrario, pero validar aquí da un mensaje legible en vez de un 400.
  const priority = (PRIORITIES as readonly string[]).includes(rawPriority)
    ? rawPriority
    : 'Media';

  const { error } = await supabase.from('support_tickets').insert({
    client_id: user.id,
    subject,
    message: message || null,
    priority,
    status: 'abierto',
  });

  if (error) return { error: error.message };

  revalidatePath('/portal/support');
  return { ok: true };
}
