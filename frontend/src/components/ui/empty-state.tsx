import type { LucideIcon } from 'lucide-react'
import { Ban } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/components/ui/empty'

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
    <Empty
      className={cn('h-50 rounded-md border border-dashed p-8', className)}
    >
      <EmptyHeader>
        <EmptyMedia className="bg-primary/10 rounded-full" variant="icon">
          <Icon className="text-primary" />
        </EmptyMedia>
        <EmptyTitle className="font-semibold">{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      {action && <EmptyContent>{action}</EmptyContent>}
    </Empty>
  )
}
