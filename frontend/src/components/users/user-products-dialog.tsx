import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useGetUserProducts } from '@/hooks/use-users'
import { ProductStatus } from '@/lib/api-types'
import { Loader2 } from 'lucide-react'

export function UserProductsDialog({
  userId,
  userName,
  open,
  onOpenChange
}: {
  userId: string
  userName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { data: products, isLoading, isError } = useGetUserProducts(userId)

  const formatProductStatus = (status: ProductStatus) => {
    const statusMap: Record<
      ProductStatus,
      { label: string; className: string }
    > = {
      IN_STOCK: {
        label: 'Em Estoque',
        className: 'bg-[var(--badge-4)] text-[var(--badge-text-4)]'
      },
      SOLD: {
        label: 'Vendido',
        className: 'bg-[var(--badge-6)] text-[var(--badge-text-6)]'
      },
      ASSIGNED: {
        label: 'Atribuído',
        className: 'bg-[var(--badge-2)] text-[var(--badge-text-2)]'
      }
    }

    const { label, className } = statusMap[status] || {
      label: status,
      className: ''
    }

    return (
      <Badge variant="outline" className={className}>
        {label}
      </Badge>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogTitle>Produtos de {userName}</DialogTitle>
        <DialogDescription>
          Lista de produtos no inventário do revendedor
        </DialogDescription>

        {isLoading && (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        )}

        {isError && (
          <div className="text-destructive flex h-48 items-center justify-center">
            Erro ao carregar produtos
          </div>
        )}

        {!isLoading && !isError && products && products.length === 0 && (
          <div className="text-muted-foreground flex h-48 items-center justify-center">
            Este usuário não possui produtos no inventário
          </div>
        )}

        {!isLoading && !isError && products && products.length > 0 && (
          <div className="max-h-[500px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>N. Série</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Preço</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="font-medium">
                        {product.modelName.value}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-muted-foreground font-mono text-sm">
                        {product.serialNumber.value}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatProductStatus(product.status)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      R$ {product.salePrice.value.replace('.', ',')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {!isLoading && !isError && products && products.length > 0 && (
          <div className="text-muted-foreground border-t pt-4 text-sm">
            Total: {products.length}{' '}
            {products.length === 1 ? 'produto' : 'produtos'}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
