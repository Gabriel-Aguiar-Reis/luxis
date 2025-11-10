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
import { RecentSalesTable } from '@/components/dashboard/recent-sales-table'
import { SalesChart } from '@/components/dashboard/sales-chart'
import { ProductsInStockForMoreThanXDaysTable } from '@/components/dashboard/products-in-stock-for-more-than-x-days-table'
import { KpiCarousel } from '@/components/dashboard/kpi-carousel'
import {
  useTotalSalesInPeriod,
  useTotalBillingByPeriod,
  useTotalInStockProducts,
  useTotalProductsWithResellers,
  useTotalProductsInStockForMoreThanXDays,
  useTotalOwnershipTransfersInPeriod,
  useTotalReturnsInPeriod
} from '@/hooks/use-kpis'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DollarSign,
  Users,
  Package,
  ShoppingBag,
  Truck,
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
import { ReturnsInPeriodTable } from '@/components/dashboard/returns-in-period-table'

export function AdminDashboard() {
  const [timeframe, setTimeframe] = useState('year')
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

  const productsKpi = useTotalInStockProducts()
  const productsWithResellersKpi = useTotalProductsWithResellers()
  const productsInStock30dKpi = useTotalProductsInStockForMoreThanXDays(30)

  const salesKpi = useTotalSalesInPeriod({
    start: dateRange.start.toISOString(),
    end: dateRange.end.toISOString()
  })
  const billingKpi = useTotalBillingByPeriod({
    start: dateRange.start.toISOString(),
    end: dateRange.end.toISOString()
  })

  const ownershipTransfersKpi = useTotalOwnershipTransfersInPeriod({
    start: dateRange.start.toISOString(),
    end: dateRange.end.toISOString()
  })

  const totalReturnsKpi = useTotalReturnsInPeriod({
    start: dateRange.start.toISOString(),
    end: dateRange.end.toISOString()
  })

  const isLoading =
    productsKpi.isLoading ||
    productsWithResellersKpi.isLoading ||
    salesKpi.isLoading ||
    billingKpi.isLoading ||
    ownershipTransfersKpi.isLoading ||
    totalReturnsKpi.isLoading

  return (
    <div className="flex-1 space-y-4">
      <div className="flex flex-col gap-4 px-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Dashboard
        </h2>
        <Tabs
          defaultValue="year"
          value={timeframe}
          onValueChange={setTimeframe}
        >
          <TabsList className="grid w-full grid-cols-3 sm:w-auto">
            <TabsTrigger value="week">Semana</TabsTrigger>
            <TabsTrigger value="month">Mês</TabsTrigger>
            <TabsTrigger value="year">Ano</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="justify-center space-y-4 px-4">
        <KpiCarousel
          type="produtos"
          isLoading={isLoading}
          kpis={[
            {
              title: 'Produtos em Estoque',
              value: productsKpi.data ?? 0,
              icon: Package,
              description: 'Total em estoque'
            },
            {
              title: 'Produtos',
              value: productsWithResellersKpi.data ?? 0,
              icon: Users,
              description: 'Com revendedores'
            },
            {
              title: 'Há mais de 30 dias',
              value: productsInStock30dKpi.data ?? 0,
              icon: Package,
              description: 'Em estoque há mais de 30 dias'
            },
            {
              title: 'Vendas no Período',
              value: salesKpi.data?.totalSales ?? 0,
              icon: ShoppingBag,
              description: 'Vendas'
            },
            {
              title: 'Faturamento no Período',
              value: billingKpi.data?.total ?? 0,
              icon: DollarSign,
              description: 'Faturamento',
              prefix: 'R$ ',
              valueFormatter: (v: number) =>
                v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
            },
            {
              title: 'Transferências no Período',
              value: ownershipTransfersKpi.data ?? 0,
              icon: Truck,
              description: 'No período'
            },
            {
              title: 'Devoluções no Período',
              value: totalReturnsKpi.data?.totalReturns ?? 0,
              icon: Undo2,
              description: 'No período'
            }
          ]}
        />
      </div>

      <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>Vendas</CardTitle>
            <CardDescription>
              Evolução de vendas no período selecionado
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {salesKpi.isLoading ? (
              <Skeleton className="h-[350px] w-full" />
            ) : (
              <SalesChart
                start={dateRange.start.toISOString()}
                end={dateRange.end.toISOString()}
                timeframe={timeframe as 'week' | 'month' | 'year'}
              />
            )}
          </CardContent>
        </Card>
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Vendas Recentes</CardTitle>
            <CardDescription>Últimas vendas realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            {salesKpi.isLoading ? (
              <Skeleton className="h-[350px] w-full" />
            ) : (
              <RecentSalesTable
                start={dateRange.start.toISOString()}
                end={dateRange.end.toISOString()}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 px-4 pb-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Distribuição de Estoque</CardTitle>
            <CardDescription>
              Produtos no Estoque por mais de 10 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            {productsKpi.isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ProductsInStockForMoreThanXDaysTable />
            )}
          </CardContent>
        </Card>
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>Devoluções Realizadas no Período</CardTitle>
          </CardHeader>
          <CardContent>
            {ownershipTransfersKpi.isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="mt-6">
                <ReturnsInPeriodTable
                  query={{
                    start: dateRange.start.toISOString(),
                    end: dateRange.end.toISOString()
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
