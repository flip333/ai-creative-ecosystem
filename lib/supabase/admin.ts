import { createClient } from '@supabase/supabase-js';

/**
 * Cliente con service_role. Salta RLS por completo, así que SÓLO puede
 * usarse en server actions que ya hayan verificado role === 'admin'.
 *
 * Devuelve null si la clave no está configurada, en vez de lanzar: así la
 * app despliega y todo lo demás funciona, y sólo la invitación de usuarios
 * (única operación que necesita la Admin API de Auth) avisa que falta la
 * variable de entorno.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) return null;

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
