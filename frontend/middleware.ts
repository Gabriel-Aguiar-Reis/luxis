import createMiddleware from 'next-intl/middleware'
import { routing } from '@/lib/i18n/routing'
import { AUTH_TOKEN_COOKIE } from '@/lib/auth-cookie'
import { NextRequest } from 'next/server'

type JwtPayload = {
  exp?: number
  role?: string
  status?: string
}

const intlMiddleware = createMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: true
})

function decodeBase64Url(value: string): string | null {
  try {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      '='
    )

    return atob(padded)
  } catch {
    return null
  }
}

function parseJwtPayload(token: string): JwtPayload | null {
  const parts = token.split('.')

  if (parts.length < 2) {
    return null
  }

  const decoded = decodeBase64Url(parts[1])

  if (!decoded) {
    return null
  }

  try {
    return JSON.parse(decoded) as JwtPayload
  } catch {
    return null
  }
}

function isJwtExpired(payload: JwtPayload | null): boolean {
  if (!payload?.exp) {
    return false
  }

  return payload.exp * 1000 <= Date.now()
}

function stripLocaleFromPath(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)
  const maybeLocale = segments[0]

  if (maybeLocale && routing.locales.includes(maybeLocale as 'en' | 'pt')) {
    const rest = segments.slice(1)
    return '/' + rest.join('/')
  }

  return pathname
}

function withLocalePrefix(request: NextRequest, targetPath: string) {
  const segments = request.nextUrl.pathname.split('/').filter(Boolean)
  const maybeLocale = segments[0]
  const locale = routing.locales.includes(maybeLocale as 'en' | 'pt')
    ? maybeLocale
    : routing.defaultLocale

  const localizedPath =
    locale === routing.defaultLocale ? targetPath : `/${locale}${targetPath}`

  return new URL(localizedPath, request.url)
}

interface MiddlewareContext {
  request: NextRequest
  pathname: string
  isAuthenticated: boolean
  isActive: boolean
  role: string | undefined
}

interface RouteStrategy {
  matches(ctx: MiddlewareContext): boolean
  handle(ctx: MiddlewareContext): Response
}

class AdminAreaStrategy implements RouteStrategy {
  matches({ pathname, isAuthenticated, isActive, role }: MiddlewareContext) {
    const isAdminArea = pathname === '/home' || pathname.startsWith('/home/')
    return isAdminArea && (!isAuthenticated || !isActive || role !== 'ADMIN')
  }

  handle({ request }: MiddlewareContext) {
    return Response.redirect(withLocalePrefix(request, '/admin-login'))
  }
}

class ResellerAreaStrategy implements RouteStrategy {
  matches({ pathname, isAuthenticated, isActive, role }: MiddlewareContext) {
    const isResellerArea =
      pathname === '/my-space' || pathname.startsWith('/my-space/')
    return (
      isResellerArea && (!isAuthenticated || !isActive || role !== 'RESELLER')
    )
  }

  handle({ request }: MiddlewareContext) {
    return Response.redirect(withLocalePrefix(request, '/login'))
  }
}

class AdminLoginRedirectStrategy implements RouteStrategy {
  matches({ pathname, isAuthenticated, isActive, role }: MiddlewareContext) {
    return (
      isAuthenticated &&
      isActive &&
      pathname === '/admin-login' &&
      role === 'ADMIN'
    )
  }

  handle({ request }: MiddlewareContext) {
    return Response.redirect(withLocalePrefix(request, '/home'))
  }
}

class ResellerLoginRedirectStrategy implements RouteStrategy {
  matches({ pathname, isAuthenticated, isActive, role }: MiddlewareContext) {
    return (
      isAuthenticated &&
      isActive &&
      pathname === '/login' &&
      role === 'RESELLER'
    )
  }

  handle({ request }: MiddlewareContext) {
    return Response.redirect(withLocalePrefix(request, '/my-space'))
  }
}

class RootRedirectStrategy implements RouteStrategy {
  matches({ pathname, isAuthenticated, isActive, role }: MiddlewareContext) {
    const isRootPath = pathname === '/' || pathname === ''
    return (
      isAuthenticated &&
      isActive &&
      isRootPath &&
      (role === 'ADMIN' || role === 'RESELLER')
    )
  }

  handle({ request, role }: MiddlewareContext) {
    if (role === 'ADMIN') {
      return Response.redirect(withLocalePrefix(request, '/home'))
    }
    return Response.redirect(withLocalePrefix(request, '/my-space'))
  }
}

const strategies: RouteStrategy[] = [
  new AdminAreaStrategy(),
  new ResellerAreaStrategy(),
  new AdminLoginRedirectStrategy(),
  new ResellerLoginRedirectStrategy(),
  new RootRedirectStrategy()
]

export function middleware(request: NextRequest) {
  const pathname = stripLocaleFromPath(request.nextUrl.pathname)
  const rawToken = request.cookies.get(AUTH_TOKEN_COOKIE)?.value
  const token = rawToken ? decodeURIComponent(rawToken) : null
  const payload = token ? parseJwtPayload(token) : null
  const isAuthenticated = Boolean(token && payload && !isJwtExpired(payload))
  const role = payload?.role
  const status = payload?.status
  const isActive = status === 'ACTIVE'

  const ctx: MiddlewareContext = {
    request,
    pathname,
    isAuthenticated,
    isActive,
    role
  }

  for (const strategy of strategies) {
    if (strategy.matches(ctx)) {
      return strategy.handle(ctx)
    }
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/', '/((?!api|trpc|_next|_vercel|.*\\..*).*)', '/:locale/:path*']
}
