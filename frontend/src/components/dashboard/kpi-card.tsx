'use client'

import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: number
  description?: string
  icon: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  prefix?: string
  suffix?: string
  valueFormatter?: (value: number) => string
}

export function KpiCard({
  title,
  value,
  description = '',
  icon: Icon,
  trend = 'neutral',
  prefix = '',
  suffix = '',
  valueFormatter = (value) => value.toString()
}: KpiCardProps) {
  return (
    <Card className="h-32 sm:h-32 md:h-36">
      <CardContent className="p-3 sm:p-4 md:p-5">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex min-w-0 flex-1 flex-col space-y-1">
            <span className="text-muted-foreground text-[11px] font-medium sm:text-xs">
              {title}
            </span>
            <span className="truncate text-lg font-bold sm:text-xl">
              {prefix}
              {valueFormatter(value)}
              {suffix}
            </span>
            <span className="text-muted-foreground flex items-center text-[9px] sm:text-[10px]">
              {trend === 'up' ? (
                <TrendingUp className="mr-1 h-2.5 w-2.5 shrink-0 text-green-500 sm:h-3 sm:w-3" />
              ) : trend === 'down' ? (
                <TrendingDown className="mr-1 h-2.5 w-2.5 shrink-0 text-red-500 sm:h-3 sm:w-3" />
              ) : null}
              <span
                className={`line-clamp-2 ${
                  trend === 'up'
                    ? 'text-green-500'
                    : trend === 'down'
                      ? 'text-red-500'
                      : ''
                }`}
              >
                {description}
              </span>
            </span>
          </div>
          <div className="bg-primary/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10 md:h-11 md:w-11">
            <Icon className="text-primary h-4 w-4 sm:h-5 sm:w-5 md:h-5.5 md:w-5.5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
