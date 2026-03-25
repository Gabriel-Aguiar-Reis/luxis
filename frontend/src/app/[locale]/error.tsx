'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'

export default function LocaleError({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('ErrorPages.locale')

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-12">
      <div className="bg-card w-full max-w-md space-y-4 rounded-xl border p-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">{t('title')}</h2>
          <p className="text-muted-foreground text-sm">{t('description')}</p>
          <p className="text-muted-foreground text-xs">
            {error.digest
              ? `${t('referencePrefix')}: ${error.digest}`
              : t('unknownReference')}
          </p>
        </div>
        <button
          className="bg-primary text-primary-foreground inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium"
          onClick={() => reset()}
          type="button"
        >
          {t('retry')}
        </button>
      </div>
    </div>
  )
}
