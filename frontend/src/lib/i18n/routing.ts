import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'pt'],
  defaultLocale: 'pt',
  // Forcing an explicit locale prefix keeps routes consistent
  // (e.g. /pt/home instead of /home) which prevents missing-locale
  // 404s when navigating from client links.
  localePrefix: 'always'
})
