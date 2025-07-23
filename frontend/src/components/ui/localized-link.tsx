'use client'

import React from 'react'
import { Link as NextIntlLink } from '@/lib/i18n/navigation'
import { useLocalizedRoute } from '@/lib/i18n/routes'

type LocalizedLinkProps = React.ComponentPropsWithoutRef<
  typeof NextIntlLink
> & {
  preserveLocale?: boolean
}

/**
 * Component Link that supports translated routes
 *
 * This component extends the Link from next-intl to support translated routes
 * automatically, without the need to manually translate each route.
 */
export function LocalizedLink({
  href,
  children,
  preserveLocale = true,
  ...props
}: LocalizedLinkProps) {
  const getLocalizedRoute = useLocalizedRoute()

  const processedHref = React.useMemo(() => {
    if (typeof href !== 'string') return href

    if (href.startsWith('mailto:') || href.startsWith('tel:')) {
      return href
    }

    const parts = href.split('/').filter(Boolean)

    if (parts.length === 0) return href

    const processedParts = parts.map((part) => getLocalizedRoute(part))

    return '/' + processedParts.join('/')
  }, [href, getLocalizedRoute])

  return (
    <NextIntlLink href={processedHref} {...props}>
      {children}
    </NextIntlLink>
  )
}
