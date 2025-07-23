'use client'

import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useRecentSales } from '@/hooks/use-sales'

export function RecentSalesTable({
  start,
  end
}: {
  start: string
  end: string
}) {
  const {
    data: data,
    isLoading,
    isError
  } = useRecentSales({ start, end, limit: 5 })

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
        Erro ao carregar vendas recentes
      </div>
    )
  }
  const sales = data?.sales || []
  if (!sales || sales.length === 0) {
    return (
      <div className="flex h-[350px] w-full items-center justify-center text-muted-foreground">
        Nenhuma venda recente encontrada
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {sales.map((sale) => (
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
            <p className="text-sm font-medium leading-none">
              {sale.customerName || sale.customerId}
            </p>
            <p className="text-sm text-muted-foreground">
              Revendedor: {sale.resellerName || sale.resellerId}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-sm font-medium">
              R$ {sale.totalAmount.replace('.', ',')}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(sale.saleDate), {
                addSuffix: true,
                locale: ptBR
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
