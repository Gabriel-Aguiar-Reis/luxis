import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { GetOneSaleResponse } from '@/hooks/use-sales'

export function SaleDeleteDialog({
  isOpen,
  onClose,
  onDelete,
  sale
}: {
  isOpen: boolean
  onClose: () => void
  onDelete: (id: string) => void
  sale: GetOneSaleResponse | null
}) {
  const handleDelete = () => {
    if (sale) {
      onDelete(sale.id)
      onClose()
    }
  }

  if (!sale) return null

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy', { locale: ptBR })
    } catch (error) {
      return 'Data inválida'
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Venda</AlertDialogTitle>
          <AlertDialogDescription>
            A venda será excluída permanentemente.
            <br />
            <br />
            Tem certeza que deseja excluir a venda do revendedor{' '}
            <strong>{sale.resellerName}</strong> de{' '}
            <strong>{formatDate(sale.saleDate)}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Excluir
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
