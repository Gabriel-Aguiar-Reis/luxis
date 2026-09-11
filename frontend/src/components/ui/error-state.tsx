'use client'

import { AlertTriangle, RotateCw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ErrorStateProps = {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title,
  description,
  onRetry,
  className
}: ErrorStateProps) {
  const t = useTranslations('Common')

  return (
    <div
      className={cn(
        'flex h-50 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center',
        className
      )}
    >
      <div className="bg-destructive/10 flex h-12 w-12 items-center justify-center rounded-full">
        <AlertTriangle className="text-destructive h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">
        {title ?? t('loadErrorTitle')}
      </h3>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm">
        {description ?? t('loadErrorDescription')}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          <RotateCw className="mr-2 h-4 w-4" />
          {t('retry')}
        </Button>
      )}
    </div>
  )
}
