import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const pathname = req.nextUrl.pathname

  // Rutas públicas que no requieren autenticación
  const publicPaths = ['/login', '/']
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // No autenticado -> redirigir a login
  if (!token) {
    const url = new URL('/login', req.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  // Admin only
  if (pathname.startsWith('/admin') && token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Company admin solo puede acceder a /dashboard/company y rutas relacionadas
  if (pathname.startsWith('/dashboard/company') && token.role !== 'COMPANY_ADMIN' && token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Usuarios normales no pueden ir a rutas de admin ni company admin
  if (token.role === 'USER' && (pathname.startsWith('/admin') || pathname.startsWith('/dashboard/company'))) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}