import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { GetOneReturnResponse } from '@/hooks/use-returns'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function ReturnDeleteDialog({
  isOpen,
  onClose,
  onDelete,
  ret
}: {
  isOpen: boolean
  onClose: () => void
  onDelete: (id: string) => void
  ret: GetOneReturnResponse | null
}) {
  const handleDelete = () => {
    if (ret) {
      onDelete(ret.id)
      onClose()
    }
  }

  if (!ret) return null

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
          <AlertDialogTitle>Excluir Devolução</AlertDialogTitle>
          <AlertDialogDescription>
            A devolução será excluída permanentemente.
            <br />
            <br />
            Tem certeza que deseja excluir a devolução do revendedor{' '}
            <strong>{ret.resellerName}</strong> de{' '}
            <strong>{formatDate(ret.createdAt)}</strong>?
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
