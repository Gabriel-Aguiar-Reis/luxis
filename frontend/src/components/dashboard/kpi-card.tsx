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
    <Card className="h-36 sm:h-40 md:h-44">
      <CardContent className="p-4 sm:p-5 md:p-6">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex min-w-0 flex-1 flex-col space-y-1">
            <span className="text-muted-foreground text-xs font-medium sm:text-sm">
              {title}
            </span>
            <span className="truncate text-xl font-bold sm:text-2xl">
              {prefix}
              {valueFormatter(value)}
              {suffix}
            </span>
            <span className="text-muted-foreground flex items-center text-[10px] sm:text-xs">
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
          <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg sm:h-11 sm:w-11 md:h-12 md:w-12">
            <Icon className="text-primary h-5 w-5 sm:h-5.5 sm:w-5.5 md:h-6 md:w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
