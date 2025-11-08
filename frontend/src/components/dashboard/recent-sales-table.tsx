'use client'

import { formatDistanceToNow, format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useSalesInPeriod } from '@/hooks/use-kpis'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

export function RecentSalesTable({
  start,
  end
}: {
  start: string
  end: string
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { data: data, isLoading, isError } = useSalesInPeriod({ start, end })

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
        Erro ao carregar vendas recentes
      </div>
    )
  }
  const sales = data?.sales || []
  if (!sales || sales.length === 0) {
    return (
      <div className="text-muted-foreground flex h-[350px] w-full items-center justify-center">
        Nenhuma venda recente encontrada
      </div>
    )
  }

  const displayedSales = sales.slice(0, 5)
  const hasMore = sales.length > 5

  const formatDateRange = () => {
    try {
      const startDate = format(parseISO(start), 'dd/MM/yyyy', { locale: ptBR })
      const endDate = format(parseISO(end), 'dd/MM/yyyy', { locale: ptBR })
      return `${startDate} a ${endDate}`
    } catch {
      return 'período selecionado'
    }
  }

  const renderSaleItem = (sale: (typeof sales)[0]) => (
    <div key={sale.id} className="flex items-center">
      <Avatar className="h-9 w-9">
        <AvatarFallback>
          {(sale.customerName || sale.customerId || '?')
            .toString()
            .split(' ')
            .filter((n) => n)
            .slice(0, 2)
            .map((n) => n[0])
            .join('')
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="ml-4 space-y-1">
        <p className="text-sm leading-none font-medium">
          {sale.customerName || sale.customerId}
        </p>
        <p className="text-muted-foreground text-sm">
          Revendedor: {sale.resellerName || sale.resellerId}
        </p>
      </div>
      <div className="ml-auto text-right">
        <p className="text-sm font-medium">
          R$ {sale.totalAmount.replace('.', ',')}
        </p>
        <p className="text-muted-foreground text-xs">
          {formatDistanceToNow(new Date(sale.saleDate), {
            addSuffix: true,
            locale: ptBR
          })}
        </p>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="space-y-8">{displayedSales.map(renderSaleItem)}</div>

      {hasMore && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground w-full justify-between"
            >
              <span>Ver mais {sales.length - 5} vendas</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] max-w-2xl">
            <DialogHeader>
              <DialogTitle>Vendas do Período</DialogTitle>
              <DialogDescription>
                {formatDateRange()} • {sales.length}{' '}
                {sales.length === 1 ? 'venda' : 'vendas'}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-6">{sales.map(renderSaleItem)}</div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
