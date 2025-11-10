'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useLongestTimeInInventory } from '@/hooks/use-kpis'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function LongestInventoryProductsTable({
  start,
  end
}: {
  start?: string
  end?: string
}) {
  const { data, isLoading, isError } = useLongestTimeInInventory({
    start,
    end
  })

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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Modelo</TableHead>
            <TableHead className="text-right">Tempo em Estoque</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((product: any, index: number) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                {product.productName || 'N/A'}
              </TableCell>
              <TableCell>{product.modelName || 'N/A'}</TableCell>
              <TableCell className="text-right">
                {product.dateAcquired
                  ? formatDistanceToNow(new Date(product.dateAcquired), {
                      addSuffix: true,
                      locale: ptBR
                    })
                  : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
