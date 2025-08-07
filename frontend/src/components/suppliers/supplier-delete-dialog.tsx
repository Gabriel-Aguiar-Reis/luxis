import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Supplier } from '@/lib/api-types'

export function SupplierDeleteDialog({
  isOpen,
  onClose,
  onDelete,
  supplier
}: {
  isOpen: boolean
  onClose: () => void
  onDelete: (id: string) => void
  supplier: Supplier | null
}) {
  const handleDelete = () => {
    if (supplier) {
      onDelete(supplier.id)
      onClose()
    }
  }

  if (!supplier) return null

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Fornecedor</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o fornecedor{' '}
            <strong>{supplier.name.value}</strong>?
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
