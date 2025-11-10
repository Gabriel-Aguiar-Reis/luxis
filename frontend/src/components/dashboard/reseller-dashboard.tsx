'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { KpiCarousel } from '@/components/dashboard/kpi-carousel'
import { ResellerSalesChart } from '@/components/dashboard/reseller-sales-chart'
import { TopSellingProductsTable } from '@/components/dashboard/top-selling-products-table'
import { LongestInventoryProductsTable } from '@/components/dashboard/longest-inventory-products-table'
import {
  useMonthlySales,
  useAverageTicket,
  useCurrentInventory,
  useReturnCount
} from '@/hooks/use-kpis'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
  Undo2
} from 'lucide-react'
import {
  startOfWeek,
  startOfMonth,
  startOfYear,
  endOfWeek,
  endOfMonth,
  endOfYear
} from 'date-fns'

export function ResellerDashboard() {
  const [timeframe, setTimeframe] = useState('month')
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>(() => {
    const now = new Date()
    return {
      start: startOfMonth(now),
      end: endOfMonth(now)
    }
  })

  useEffect(() => {
    const now = new Date()
    let start: Date, end: Date
    switch (timeframe) {
      case 'week':
        start = startOfWeek(now, { weekStartsOn: 1 })
        end = endOfWeek(now, { weekStartsOn: 1 })
        break
      case 'year':
        start = startOfYear(now)
        end = endOfYear(now)
        break
      default:
        start = startOfMonth(now)
        end = endOfMonth(now)
        break
    }

    setDateRange({ start, end })
  }, [timeframe])

  const monthlySalesKpi = useMonthlySales({
    start: dateRange.start.toISOString(),
    end: dateRange.end.toISOString()
  })

  const averageTicketKpi = useAverageTicket({
    start: dateRange.start.toISOString(),
    end: dateRange.end.toISOString()
  })

  const inventoryKpi = useCurrentInventory()

  const returnsKpi = useReturnCount({
    start: dateRange.start.toISOString(),
    end: dateRange.end.toISOString()
  })

  const isLoading =
    monthlySalesKpi.isLoading ||
    averageTicketKpi.isLoading ||
    inventoryKpi.isLoading ||
    returnsKpi.isLoading

  const totalSalesInPeriod =
    Array.isArray(monthlySalesKpi.data) && monthlySalesKpi.data.length > 0
      ? monthlySalesKpi.data.reduce(
          (acc: number, item: any) => acc + (item.total || 0),
          0
        )
      : 0

  const totalProductsInStock =
    Array.isArray(inventoryKpi.data) && inventoryKpi.data.length > 0
      ? inventoryKpi.data.reduce(
          (acc: number, item: any) => acc + (item.quantity || 0),
          0
        )
      : 0

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between px-4 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Tabs
          defaultValue="month"
          value={timeframe}
          onValueChange={setTimeframe}
        >
          <TabsList>
            <TabsTrigger value="week">Semana</TabsTrigger>
            <TabsTrigger value="month">Mês</TabsTrigger>
            <TabsTrigger value="year">Ano</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="justify-center space-y-4 px-4">
        <KpiCarousel
          type="vendas"
          isLoading={isLoading}
          kpis={[
            {
              title: 'Vendas no Período',
              value: totalSalesInPeriod,
              icon: ShoppingBag,
              description: 'Total de vendas realizadas'
            },
            {
              title: 'Ticket Médio',
              value: averageTicketKpi.data ?? 0,
              icon: DollarSign,
              description: 'Valor médio por venda',
              prefix: 'R$ ',
              valueFormatter: (v: number) =>
                v.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })
            },
            {
              title: 'Produtos em Estoque',
              value: totalProductsInStock,
              icon: Package,
              description: 'Total em seu inventário'
            },
            {
              title: 'Devoluções no Período',
              value: returnsKpi.data ?? 0,
              icon: Undo2,
              description: 'Total de devoluções'
            }
          ]}
        />
      </div>

      <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Evolução de Vendas</CardTitle>
            <CardDescription>
              Vendas realizadas no período selecionado
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {monthlySalesKpi.isLoading ? (
              <Skeleton className="h-[350px] w-full" />
            ) : (
              <ResellerSalesChart
                data={monthlySalesKpi.data as any[]}
                timeframe={timeframe as 'week' | 'month' | 'year'}
              />
            )}
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
            <CardDescription>Top produtos por vendas</CardDescription>
          </CardHeader>
          <CardContent>
            <TopSellingProductsTable
              start={dateRange.start.toISOString()}
              end={dateRange.end.toISOString()}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 px-4 pb-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Produtos em Estoque</CardTitle>
            <CardDescription>
              Produtos há mais tempo no inventário
            </CardDescription>
          </CardHeader>
          <CardContent>
            {inventoryKpi.isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <LongestInventoryProductsTable />
            )}
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Insights e Recomendações</CardTitle>
            <CardDescription>
              Ações para melhorar seu desempenho
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 mt-0.5 rounded-full p-2">
                  <TrendingUp className="text-primary h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Analise seus produtos</p>
                  <p className="text-muted-foreground text-sm">
                    Identifique produtos parados há muito tempo e considere
                    promoções ou devoluções
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 mt-0.5 rounded-full p-2">
                  <ShoppingBag className="text-primary h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Foque nos mais vendidos</p>
                  <p className="text-muted-foreground text-sm">
                    Mantenha estoque dos produtos que mais vendem para maximizar
                    suas vendas
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 mt-0.5 rounded-full p-2">
                  <Package className="text-primary h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Gerencie seu inventário</p>
                  <p className="text-muted-foreground text-sm">
                    Mantenha um equilíbrio entre produtos em estoque e
                    velocidade de vendas
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
