import { createBrowserClient } from '@supabase/ssr';

/**
 * Cliente de Supabase para el NAVEGADOR (Client Components, `'use client'`).
 *
 * Usa la llave pública `anon`, así que solo puede hacer lo que RLS le permita
 * al usuario logueado — nunca tiene poder de admin. La sesión viaja en cookies
 * HTTP-only (no en localStorage), así resiste XSS y funciona con SSR.
 *
 * Los `|| 'placeholder'` evitan que el build truene si faltan las variables de
 * entorno; en runtime real siempre llegan las de verdad.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';

  return createBrowserClient(supabaseUrl, supabaseKey);
}
