'use client'

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { useSalesInPeriod } from '@/hooks/use-sales'
import { getSalesChartData } from '@/hooks/use-sales'

const chartConfig = {
  sales: {
    label: 'Vendas',
    color: 'var(--chart-1)'
  }
} satisfies ChartConfig

export function SalesChart({ start, end }: { start: string; end: string }) {
  const { data, isLoading, isError } = useSalesInPeriod({ start, end })

  if (isLoading) {
    return (
      <div className="flex h-[350px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-[350px] w-full items-center justify-center text-destructive">
        Erro ao carregar vendas
      </div>
    )
  }

  const sales = data?.sales || []
  if (!sales || sales.length === 0) {
    return (
      <div className="flex h-[350px] w-full items-center justify-center text-muted-foreground">
        Nenhuma venda encontrada no período selecionado
      </div>
    )
  }
  console.log(getSalesChartData(sales))
  return (
    <ChartContainer config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={getSalesChartData(sales)}
        margin={{
          left: 12,
          right: 12
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) =>
            new Intl.DateTimeFormat('pt-BR', {
              month: 'short',
              day: '2-digit'
            }).format(value)
          }
          fontSize={12}
          stroke="var(--chart-1)"
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" hideLabel />}
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
          fillOpacity={0.4}
          stroke="var(--color-sales)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  )
}
