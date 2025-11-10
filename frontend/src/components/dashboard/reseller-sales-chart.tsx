'use client'

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { useMemo } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const chartConfig = {
  total: {
    label: 'Vendas',
    color: 'var(--chart-1)'
  },
  count: {
    label: 'Quantidade',
    color: 'var(--chart-2)'
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

    return data
      .map((item: any) => {
        const year = item.year || new Date().getFullYear()
        const month = item.month || 0
        const date = new Date(year, month, 1)

        return {
          day: date.getTime(),
          date: format(date, 'dd/MM/yyyy', { locale: ptBR }),
          total: Number(item.totalAmount) || item.total || 0,
          count: item.countSales || 0
        }
      })
      .sort((a: any, b: any) => a.day - b.day)
  }, [data])

  if (!data || chartData.length === 0) {
    return (
      <div className="text-muted-foreground flex h-[250px] w-full items-center justify-center text-center text-xs sm:h-[300px] sm:text-sm md:h-[350px]">
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
    <ChartContainer
      config={chartConfig}
      className="h-[250px] w-full sm:h-[300px] md:h-[350px]"
    >
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 8,
          right: 8,
          top: 16,
          bottom: 8
        }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={xAxisFormatter}
          fontSize={10}
          stroke="var(--chart-1)"
          className="sm:text-xs"
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
          <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-count)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-count)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="count"
          type="natural"
          fill="url(#fillCount)"
          dot={{
            stroke: 'var(--color-count)',
            strokeWidth: 2,
            fill: 'var(--color-count)'
          }}
          fillOpacity={0.4}
          stroke="var(--color-count)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  )
}
