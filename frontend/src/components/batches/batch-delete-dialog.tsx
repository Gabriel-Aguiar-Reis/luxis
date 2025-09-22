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
import { GetOneBatchResponse } from '@/hooks/use-batches'

export function BatchDeleteDialog({
  isOpen,
  onClose,
  onDelete,
  batch
}: {
  isOpen: boolean
  onClose: () => void
  onDelete: (id: string) => void
  batch: GetOneBatchResponse | null
}) {
  const handleDelete = () => {
    if (batch) {
      onDelete(batch.id)
      onClose()
    }
  }

  if (!batch) return null

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
          <AlertDialogTitle>Excluir Lote de Fornecimento</AlertDialogTitle>
          <AlertDialogDescription>
            O lote de fornecimento será excluído permanentemente.
            <br />
            <br />
            Tem certeza que deseja excluir o lote de fornecimento de{' '}
            <strong>{formatDate(batch.arrivalDate)}</strong>?
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
