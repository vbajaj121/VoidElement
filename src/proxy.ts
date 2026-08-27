import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'

/**
 * Next 16 renamed Middleware to Proxy (functionally identical). Session
 * strategy is JWT (see lib/auth/auth.ts), so `auth()` here only decodes the
 * signed cookie — no DB round trip — which keeps this an "optimistic check"
 * per Next's guidance. Route groups still re-verify role server-side
 * (admin layout) as the real authorization boundary.
 */
export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAdminRoute = pathname.startsWith('/admin')

  if (!req.auth?.user) {
    const loginUrl = new URL('/login', req.nextUrl)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAdminRoute && req.auth.user.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/account', req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/account/:path*', '/admin/:path*'],
}
