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

export function SaleConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  sale
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: (id: string) => void
  sale: GetOneSaleResponse | null
}) {
  const handleConfirm = () => {
    if (sale) {
      onConfirm(sale.id)
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

  const formatCurrency = (value: number | { value: string }) => {
    const numericValue =
      typeof value === 'number' ? value : parseFloat(value.value)
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numericValue)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Venda</AlertDialogTitle>
          <AlertDialogDescription>
            Ao confirmar a venda, os produtos serão marcados como vendidos e não
            poderão mais ser editados ou removidos da venda.
            <br />
            <br />
            Tem certeza que deseja confirmar a venda do revendedor{' '}
            <strong>{sale.resellerName}</strong> de{' '}
            <strong>{formatDate(sale.saleDate)}</strong> no valor de{' '}
            <strong>{formatCurrency(sale.totalAmount)}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="default" onClick={handleConfirm}>
            Confirmar Venda
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
