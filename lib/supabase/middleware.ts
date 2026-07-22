import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresca la sesión si expiró
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isPortalRoute = pathname.startsWith('/portal')
  const isAdminRoute = pathname.startsWith('/admin')

  if (!user && (isPortalRoute || isAdminRoute)) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Destino según rol, para /admin y para /login ya autenticado
  if (user && (isAdminRoute || pathname === '/login')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    const isAdmin = profile?.role === 'admin'

    // Sólo los admins entran al CRM. El layout de /admin repite este chequeo:
    // el middleware es la primera barrera, no la única — si algo lo saltara
    // (matcher mal configurado, un rewrite), requireAdmin y RLS siguen cubriendo.
    if (isAdminRoute && !isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = '/portal/home'
      return NextResponse.redirect(url)
    }

    if (pathname === '/login') {
      const url = request.nextUrl.clone()
      url.pathname = isAdmin ? '/admin/dashboard' : '/portal/home'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
