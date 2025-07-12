'use client'

import { toast } from 'sonner'
import { useProductsInStockForMoreThanXDays } from '@/hooks/use-kpis'
import { Separator } from '@/components/ui/separator'
import { Fragment } from 'react'

export function ProductsInStockForMoreThanXDaysTable() {
  const { data, isLoading, isError } = useProductsInStockForMoreThanXDays(10)

  if (isLoading) {
    return (
      <div
        key="loading"
        className="flex h-[350px] w-full items-center justify-center"
      >
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
      </div>
    )
  }

  if (isError) {
    toast.error('Erro ao carregar os dados do gráfico de inventário.')
    return null
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <p className="text-gray-500">Nenhum produto em estoque.</p>
      </div>
    )
  }

  // Agrupa por modelName + salePrice
  const grouped = data.reduce(
    (acc, product) => {
      const key = `${product.modelName}||${product.salePrice}`
      if (!acc[key]) {
        acc[key] = {
          modelName: product.modelName,
          salePrice: product.salePrice,
          serialNumbers: []
        }
      }
      acc[key].serialNumbers.push(product.serialNumber)
      return acc
    },
    {} as Record<
      string,
      { modelName: string; salePrice: string; serialNumbers: string[] }
    >
  )

  return (
    <div className="max-h-64 space-y-4 overflow-x-auto">
      {Object.values(grouped).map((group, idx) => (
        <Fragment key={group.modelName + group.salePrice + idx}>
          <div
            key={group.modelName + group.salePrice + idx}
            className="mr-4 flex items-start"
          >
            <div className="ml-4 flex-1 space-y-1">
              <p className="text-md font-bold leading-none">
                {group.modelName}
              </p>
              <div className="text-muted-foreground max-w-1/2 ml-4 flex flex-wrap text-xs">
                {group.serialNumbers.map((sn) => (
                  <span key={sn}>{sn}</span>
                ))}
              </div>
            </div>
            <div className="ml-auto min-w-[90px] text-right">
              <p className="text-sm font-medium">
                R${' '}
                {(Number(group.salePrice) * group.serialNumbers.length)
                  .toFixed(2)
                  .replace('.', ',')}
              </p>
              <p>
                {group.serialNumbers.length > 1 && (
                  <span className="text-muted-foreground ml-2 text-xs">
                    {group.serialNumbers.length} x R${' '}
                    {Number(group.salePrice).toFixed(2).replace('.', ',')}
                  </span>
                )}
              </p>
            </div>
          </div>
          <Separator />
        </Fragment>
      ))}
    </div>
  )
}
