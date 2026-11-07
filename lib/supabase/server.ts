import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Cliente de Supabase para el SERVIDOR (Server Components y Server Actions).
 *
 * Lee la sesión desde las cookies de la request (por eso es `async`: `cookies()`
 * lo es en Next 15). Como corre autenticado con la llave `anon`, RLS sigue
 * aplicando: solo ve los datos del usuario de esa cookie. Es el cliente que usan
 * casi todas las lecturas de `lib/queries.ts`.
 *
 * El `getAll`/`setAll` es el puente entre las cookies de Next y Supabase, que
 * las usa para refrescar el token. El `try/catch` del `setAll` es necesario:
 * desde un Server Component no se pueden escribir cookies (solo desde el
 * middleware o una Action), y ahí se ignora a propósito — el middleware ya
 * refresca la sesión en cada request.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Llamado desde un Server Component: no puede escribir cookies.
            // Se ignora porque el middleware ya refresca la sesión.
          }
        },
      },
    }
  )
}
