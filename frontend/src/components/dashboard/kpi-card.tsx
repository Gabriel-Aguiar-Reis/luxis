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
    <Card className="h-44">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground">
              {title}
            </span>
            <span className="text-2xl font-bold">
              {prefix}
              {valueFormatter(value)}
              {suffix}
            </span>
            <span className="flex items-center text-xs text-muted-foreground">
              {trend === 'up' ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              ) : trend === 'down' ? (
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              ) : null}
              <span
                className={
                  trend === 'up'
                    ? 'text-green-500'
                    : trend === 'down'
                    ? 'text-red-500'
                    : ''
                }
              >
                {description}
              </span>
            </span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
