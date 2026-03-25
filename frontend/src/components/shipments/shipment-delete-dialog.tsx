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
import { enUS, ptBR } from 'date-fns/locale'
import { GetOneShipmentResponse } from '@/hooks/use-shipments'
import { useLocale, useTranslations } from 'next-intl'

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
  const locale = useLocale()
  const t = useTranslations('ShipmentsDeleteDialog')
  const handleDelete = () => {
    if (shipment) {
      onDelete(shipment.id)
      onClose()
    }
  }

  if (!shipment) return null

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'P', {
        locale: locale === 'en' ? enUS : ptBR
      })
    } catch (error) {
      return t('invalidDate')
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('warning')}
            <br />
            <br />
            {t.rich('question', {
              resellerName: shipment.resellerName,
              createdAt: formatDate(shipment.createdAt),
              strong: (chunks) => <strong>{chunks}</strong>
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="secondary" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            {t('delete')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
