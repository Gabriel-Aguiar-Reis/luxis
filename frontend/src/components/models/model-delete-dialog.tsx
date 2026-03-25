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
import { useTranslations } from 'next-intl'

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
  const t = useTranslations('ModelsDeleteDialog')
  const { mutate: deleteModel } = useDeleteProductModel()

  const handleDelete = () => {
    deleteModel(modelId)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            {t('delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
