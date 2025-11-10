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
import { ReturnProductDto } from '@/lib/api-types'

import { ReactNode } from 'react'

export function ReturnProductsList({
  products,
  open,
  onOpenChange,
  trigger
}: {
  products: ReturnProductDto[]
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: ReactNode
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogTitle>Produtos da Devolução</DialogTitle>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.productId}>
                <TableCell>
                  {product.productModelName.value} -{' '}
                  {product.serialNumber.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}
