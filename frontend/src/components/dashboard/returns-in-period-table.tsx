'use client'

import { toast } from 'sonner'
import { useReturnsInPeriod } from '@/hooks/use-kpis'
import { Separator } from '@/components/ui/separator'
import { Fragment } from 'react'
import { GetReturnsInPeriod } from '@/lib/api-types'

export function ReturnsInPeriodTable({
  query
}: {
  query: GetReturnsInPeriod['parameters']['query']
}) {
  const { data, isLoading, isError } = useReturnsInPeriod(query)

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

  if (!data || !Array.isArray(data.returns) || data.returns.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <p className="text-gray-500">Não há devoluções no período.</p>
      </div>
    )
  }

  return (
    <div className="max-h-64 space-y-4 overflow-x-auto">
      {data.returns.map((ret, idx) => (
        <Fragment key={ret.id + idx}>
          <div className="mr-4 flex flex-col gap-2 p-2">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs">
                ID: {ret.id}
              </span>
              <span className="text-muted-foreground text-xs">
                Revendedor: {ret.resellerName}
              </span>
            </div>
            <div className="ml-2 flex flex-col gap-1">
              {ret.products && ret.products.length > 0 ? (
                ret.products.map((prod) => (
                  <div key={prod.productId} className="flex items-center gap-4">
                    <span className="text-sm font-bold">
                      {prod.productModelName}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {prod.serialNumber}
                    </span>
                  </div>
                ))
              ) : (
                <span className="text-muted-foreground text-xs">
                  Nenhum produto listado
                </span>
              )}
            </div>
          </div>
          <Separator />
        </Fragment>
      ))}
    </div>
  )
}
