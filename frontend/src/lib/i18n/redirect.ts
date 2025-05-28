import { redirect } from 'next/navigation'
import { routing } from '@/lib/i18n/routing'

export function redirectToLocale(currentPath?: string) {
  const pathname = currentPath || '/'

  if (pathname.startsWith('/en/') || pathname.startsWith('/pt/')) {
    return
  }

  const newPath =
    pathname === '/'
      ? `/${routing.defaultLocale}`
      : `/${routing.defaultLocale}${pathname}`

  redirect(newPath)
}

export function redirectToSpecificLocale(locale: string, currentPath?: string) {
  if (!routing.locales.includes(locale as 'en' | 'pt')) {
    locale = routing.defaultLocale
  }
  const pathname = currentPath || '/'

  let cleanPath = pathname
  for (const loc of routing.locales) {
    if (pathname.startsWith(`/${loc}/`)) {
      cleanPath = pathname.substring(loc.length + 1)
      break
    } else if (pathname === `/${loc}`) {
      cleanPath = '/'
      break
    }
  }

  const newPath = cleanPath === '/' ? `/${locale}` : `/${locale}${cleanPath}`

  redirect(newPath)
}
