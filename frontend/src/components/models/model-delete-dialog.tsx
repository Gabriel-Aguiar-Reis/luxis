import { useDeleteProductModel } from '@/hooks/use-product-models'

import { ProductModel } from '@/lib/api-types'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'

interface ModelDeleteDialogProps {
  isOpen: boolean
  onClose: () => void
  modelId: string
}

export function ModelDeleteDialog({
  isOpen,
  onClose,
  modelId
}: ModelDeleteDialogProps) {
  const { mutate: deleteModel } = useDeleteProductModel()

  const handleDelete = () => {
    deleteModel(modelId)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Modelo de Produto</DialogTitle>
          <DialogDescription>
            Tem certeza de que deseja excluir este modelo de produto?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
