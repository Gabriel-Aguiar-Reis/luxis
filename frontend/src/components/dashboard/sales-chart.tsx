'use client'

import { Area, AreaChart, CartesianGrid, LabelList, XAxis } from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { useSalesAggregatedByDay } from '@/hooks/use-kpis'
import { useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const chartConfig = {
  sales: {
    label: 'Vendas',
    color: 'var(--chart-1)'
  }
} satisfies ChartConfig

export function SalesChart({
  start,
  end,
  timeframe = 'month'
}: {
  start: string
  end: string
  timeframe?: 'week' | 'month' | 'year'
}) {
  const { data, isLoading, isError } = useSalesAggregatedByDay({ start, end })

  const salesData = data?.data || []

  const chartData = useMemo(() => {
    return salesData.map((item) => ({
      day: parseISO(item.date).getTime(),
      date: format(parseISO(item.date), 'dd/MM/yyyy', { locale: ptBR }),
      sales: item.sales,
      totalAmount: parseFloat(item.totalAmount)
    }))
  }, [salesData])

  if (isLoading) {
    return (
      <div className="flex h-[350px] w-full items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-destructive flex h-[350px] w-full items-center justify-center">
        Erro ao carregar vendas
      </div>
    )
  }

  if (!salesData || salesData.length === 0) {
    return (
      <div className="text-muted-foreground flex h-[350px] w-full items-center justify-center">
        Nenhuma venda encontrada no período selecionado
      </div>
    )
  }

  // Determinar o formato do eixo X baseado no timeframe
  const getXAxisFormatter = () => {
    switch (timeframe) {
      case 'week':
        // Para semana: "Seg", "Ter", "Qua", etc
        return (value: number) =>
          new Intl.DateTimeFormat('pt-BR', {
            weekday: 'short'
          }).format(value)
      case 'year':
        // Para ano: "Jan", "Fev", "Mar", etc
        return (value: number) =>
          new Intl.DateTimeFormat('pt-BR', {
            month: 'short'
          }).format(value)
      case 'month':
      default:
        // Para mês: "01 nov", "02 nov", etc
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
          <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-sales)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-sales)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="sales"
          type="natural"
          fill="url(#fillSales)"
          dot={{
            stroke: 'var(--color-sales)',
            strokeWidth: 2,
            fill: 'var(--color-sales)'
          }}
          fillOpacity={0.4}
          stroke="var(--color-sales)"
          strokeWidth={2}
        >
          <LabelList
            dataKey="sales"
            position="top"
            offset={12}
            className="fill-foreground"
          />
        </Area>
      </AreaChart>
    </ChartContainer>
  )
}
