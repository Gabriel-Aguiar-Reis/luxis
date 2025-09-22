import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { BatchProductDto } from '@/lib/api-types'

import { ReactNode } from 'react'

export function BatchProductsList({
  products,
  open,
  onOpenChange,
  trigger
}: {
  products: BatchProductDto[]
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: ReactNode
}) {
  const grouped = products.reduce<Record<string, BatchProductDto[]>>(
    (acc, product) => {
      const modelName = product.modelName?.value || 'Sem modelo'
      if (!acc[modelName]) acc[modelName] = []
      acc[modelName].push(product)
      return acc
    },
    {}
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-h-[70vh] max-w-3xl overflow-y-auto">
        <DialogTitle>Produtos do Lote</DialogTitle>
        {Object.entries(grouped).map(([model, items]) => (
          <div key={model} className="mb-4">
            <h3 className="mb-2 text-lg font-medium">{model}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número de Série</TableHead>
                  <TableHead>Custo</TableHead>
                  <TableHead>Preço de Venda</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.serialNumber.value}</TableCell>
                    <TableCell>
                      {Number(product.unitCost.value).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </TableCell>
                    <TableCell>
                      {Number(product.salePrice.value).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </DialogContent>
    </Dialog>
  )
}
