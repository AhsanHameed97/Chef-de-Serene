import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySession } from '@/lib/session'

// Server-side gate for the client portal (Master Spec: "Session Security").
// Pages re-check the session against the database; this is the fast first line.

const GUEST_ONLY = new Set(['/portal/login', '/portal/signup'])

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value)
  const home = session?.role === 'ADMIN' ? '/portal/admin' : '/portal/dashboard'

  if (pathname === '/portal/verify') return NextResponse.next()

  if (GUEST_ONLY.has(pathname)) {
    return session ? NextResponse.redirect(new URL(home, request.url)) : NextResponse.next()
  }

  if (!session) {
    const login = new URL('/portal/login', request.url)
    if (pathname !== '/portal') login.searchParams.set('next', `${pathname}${search}`)
    return NextResponse.redirect(login)
  }

  if (pathname === '/portal') return NextResponse.redirect(new URL(home, request.url))

  if (pathname.startsWith('/portal/admin') && session.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/portal/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/portal', '/portal/:path*'],
}
