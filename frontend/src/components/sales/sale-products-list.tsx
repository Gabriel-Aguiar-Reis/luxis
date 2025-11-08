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
import { GetSaleProductDto } from '@/lib/api-types'

import { ReactNode } from 'react'

export function SaleProductsList({
  products,
  open,
  onOpenChange,
  trigger
}: {
  products: GetSaleProductDto[]
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: ReactNode
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogTitle>Produtos da Venda</DialogTitle>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>N. Série</TableHead>
              <TableHead>Preço</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="flex gap-2">
                  {product.modelName.value}
                </TableCell>
                <TableCell>
                  <div className="text-muted-foreground font-mono">
                    {product.serialNumber.value}
                  </div>
                </TableCell>
                <TableCell>
                  R$ {product.salePrice.value.replace('.', ',')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}
