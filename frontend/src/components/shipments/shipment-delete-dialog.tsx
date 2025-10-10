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
import { GetOneShipmentResponse } from '@/hooks/use-shipments'

export function ShipmentDeleteDialog({
  isOpen,
  onClose,
  onDelete,
  shipment
}: {
  isOpen: boolean
  onClose: () => void
  onDelete: (id: string) => void
  shipment: GetOneShipmentResponse | null
}) {
  const handleDelete = () => {
    if (shipment) {
      onDelete(shipment.id)
      onClose()
    }
  }

  if (!shipment) return null

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
          <AlertDialogTitle>Excluir Romaneio</AlertDialogTitle>
          <AlertDialogDescription>
            O romaneio será excluído permanentemente.
            <br />
            <br />
            Tem certeza que deseja excluir o romaneio do revendedor{' '}
            <strong>{shipment.resellerName}</strong> de{' '}
            <strong>{formatDate(shipment.createdAt)}</strong>?
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
