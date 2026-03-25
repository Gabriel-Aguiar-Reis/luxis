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
import { GetOneSaleResponse } from '@/hooks/use-sales'
import { useLocale, useTranslations } from 'next-intl'

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
  const locale = useLocale()
  const t = useTranslations('SaleDialogs')

  const handleDelete = () => {
    if (sale) {
      onDelete(sale.id)
      onClose()
    }
  }

  if (!sale) return null

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
          <AlertDialogTitle>{t('deleteTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('deleteWarning')}
            <br />
            <br />
            {t.rich('deleteQuestion', {
              resellerName: sale.resellerName,
              saleDate: formatDate(sale.saleDate),
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
