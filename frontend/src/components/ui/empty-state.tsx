import type { LucideIcon } from 'lucide-react'
import { Ban } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon = Ban,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex h-50 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center',
        className
      )}
    >
      <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
        <Icon className="text-primary h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      {description && (
        <p className="text-muted-foreground mt-2 max-w-sm text-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
