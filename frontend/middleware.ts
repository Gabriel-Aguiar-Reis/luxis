import createMiddleware from 'next-intl/middleware'
import { routing } from '@/lib/i18n/routing'
import { NextRequest } from 'next/server'

// O middleware agora apenas lida com internacionalização
// A proteção de rotas é feita nos layouts client-side que têm acesso ao localStorage
export function middleware(request: NextRequest) {
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
