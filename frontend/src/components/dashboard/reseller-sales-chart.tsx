'use client'

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const chartConfig = {
  total: {
    label: 'Vendas',
    color: 'var(--chart-1)'
  }
} satisfies ChartConfig

export function ResellerSalesChart({
  data,
  timeframe = 'month'
}: {
  data: any[] | undefined
  timeframe?: 'week' | 'month' | 'year'
}) {
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data)) return []

    return data.map((item: any) => ({
      day: parseISO(item.month).getTime(),
      date: format(parseISO(item.month), 'MMM yyyy', { locale: ptBR }),
      total: item.total || 0
    }))
  }, [data])

  if (!data || chartData.length === 0) {
    return (
      <div className="text-muted-foreground flex h-[350px] w-full items-center justify-center">
        Nenhuma venda encontrada no período selecionado
      </div>
    )
  }

  const getXAxisFormatter = () => {
    switch (timeframe) {
      case 'week':
        return (value: number) =>
          new Intl.DateTimeFormat('pt-BR', {
            weekday: 'short'
          }).format(value)
      case 'year':
        return (value: number) =>
          new Intl.DateTimeFormat('pt-BR', {
            month: 'short'
          }).format(value)
      case 'month':
      default:
        return (value: number) =>
          new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'short'
          }).format(value)
    }
  }

  const xAxisFormatter = getXAxisFormatter()

  return (
    <ChartContainer config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 32,
          right: 32,
          top: 32,
          bottom: 8
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={xAxisFormatter}
          fontSize={12}
          stroke="var(--chart-1)"
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              indicator="dot"
              labelFormatter={(value, payload) => {
                if (payload && payload.length > 0) {
                  return payload[0].payload.date
                }
                return ''
              }}
            />
          }
        />
        <defs>
          <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-total)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-total)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="total"
          type="natural"
          fill="url(#fillTotal)"
          fillOpacity={0.4}
          stroke="var(--color-total)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  )
}
