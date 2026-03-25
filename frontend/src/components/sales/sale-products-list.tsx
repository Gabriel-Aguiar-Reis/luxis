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
import { useLocale, useTranslations } from 'next-intl'

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
  const locale = useLocale()
  const t = useTranslations('SaleProductsDialog')
  const currencyFormatter = new Intl.NumberFormat(
    locale === 'en' ? 'en-US' : 'pt-BR',
    {
      style: 'currency',
      currency: 'BRL'
    }
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogTitle>{t('title')}</DialogTitle>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('product')}</TableHead>
              <TableHead>{t('serialNumber')}</TableHead>
              <TableHead>{t('price')}</TableHead>
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
                  {currencyFormatter.format(Number(product.salePrice.value))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}
