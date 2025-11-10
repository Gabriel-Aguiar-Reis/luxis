'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useTopSellingProducts } from '@/hooks/use-kpis'
import { Skeleton } from '@/components/ui/skeleton'

export function TopSellingProductsTable({
  start,
  end
}: {
  start?: string
  end?: string
}) {
  const { data, isLoading, isError } = useTopSellingProducts({ start, end })

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-destructive flex h-[200px] items-center justify-center">
        Erro ao carregar produtos
      </div>
    )
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-muted-foreground flex h-[200px] items-center justify-center">
        Nenhum produto encontrado
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[120px] text-xs sm:text-sm">
              Modelo
            </TableHead>
            <TableHead className="text-right text-xs sm:text-sm">Qtd</TableHead>
            <TableHead className="min-w-[100px] text-right text-xs sm:text-sm">
              Valor Total
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((product: any, index: number) => (
            <TableRow key={index}>
              <TableCell className="text-xs font-medium sm:text-sm">
                <span className="line-clamp-2">
                  {product.modelName || 'N/A'}
                </span>
              </TableCell>
              <TableCell className="text-right text-xs sm:text-sm">
                {product.quantity || 0}
              </TableCell>
              <TableCell className="text-right text-xs whitespace-nowrap sm:text-sm">
                R${' '}
                {Number(product.totalValue || 0).toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
