import createMiddleware from 'next-intl/middleware'
import { routing } from '@/lib/i18n/routing'
import { NextRequest, NextResponse } from 'next/server'
import { useAuthStore } from '@/stores/use-auth-store'

const PROTECTED_PATHS = [
  '/my-space',
  '/home',
  '/reseller',
  '/settings',
  '/shipments',
  '/sales',
  '/inventory',
  '/customers',
  '/suppliers',
  '/returns',
  '/transfers'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path))
  if (isProtected) {
    const token = useAuthStore.getState().accessToken
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return createMiddleware({
    locales: routing.locales,
    defaultLocale: routing.defaultLocale,
    localePrefix: 'as-needed',
    localeDetection: true
  })(request)
}

export const config = {
  matcher: ['/', '/((?!api|trpc|_next|_vercel|.*\\..*).*)', '/:locale/:path*']
}
