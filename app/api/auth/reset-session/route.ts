import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE } from '@/lib/session'

// Clears a stale session (e.g. the account was removed) and returns to login.
export function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/portal/login', request.url))
  response.cookies.delete(SESSION_COOKIE)
  return response
}
