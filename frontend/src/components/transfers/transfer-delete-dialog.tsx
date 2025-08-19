import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { GetAllOwnershipTransferReturn } from '@/lib/api-types'

export function TransferDeleteDialog({
  isOpen,
  onClose,
  onDelete,
  transfer
}: {
  isOpen: boolean
  onClose: () => void
  onDelete: (id: string) => void
  transfer: GetAllOwnershipTransferReturn[0] | null
}) {
  const handleDelete = () => {
    if (transfer) {
      onDelete(transfer.id)
      onClose()
    }
  }

  if (!transfer) return null

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Transferência</AlertDialogTitle>
          <AlertDialogDescription>
            A transferência de propriedade será excluída permanentemente.
            <br />
            <br />
            Tem certeza que deseja excluir a transferência do produto{' '}
            <strong>{transfer.serialNumber}</strong> de{' '}
            <strong>{transfer.fromResellerName}</strong> para{' '}
            <strong>{transfer.toResellerName}</strong>?
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
