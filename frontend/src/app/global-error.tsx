'use client'

import { useEffect, useMemo, useState } from 'react'
import enMessages from '@/messages/en.json'
import ptMessages from '@/messages/pt.json'

type SupportedLocale = 'en' | 'pt'

function resolveLocale(): SupportedLocale {
  if (typeof document === 'undefined') {
    return 'pt'
  }

  return document.documentElement.lang.startsWith('en') ? 'en' : 'pt'
}

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [locale, setLocale] = useState<SupportedLocale>('pt')

  useEffect(() => {
    setLocale(resolveLocale())
  }, [])

  const t = useMemo(() => {
    return locale === 'en'
      ? enMessages.ErrorPages.global
      : ptMessages.ErrorPages.global
  }, [locale])

  return (
    <html>
      <body className="bg-background text-foreground flex min-h-screen items-center justify-center px-6 py-12">
        <div className="bg-card w-full max-w-md space-y-4 rounded-xl border p-6 shadow-sm">
          <div className="space-y-2" suppressHydrationWarning>
            <h1 className="text-2xl font-semibold">{t.title}</h1>
            <p className="text-muted-foreground text-sm">{t.description}</p>
            <p className="text-muted-foreground text-xs">
              {error.digest
                ? `${t.referencePrefix}: ${error.digest}`
                : t.unknownReference}
            </p>
          </div>
          <button
            className="bg-primary text-primary-foreground inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium"
            onClick={() => reset()}
            type="button"
          >
            {t.retry}
          </button>
        </div>
      </body>
    </html>
  )
}
