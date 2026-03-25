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
import { enUS, ptBR } from 'date-fns/locale'
import { useLocale, useTranslations } from 'next-intl'

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
  const locale = useLocale()
  const t = useTranslations('ReturnsDeleteDialog')
  const handleDelete = () => {
    if (ret) {
      onDelete(ret.id)
      onClose()
    }
  }

  if (!ret) return null

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
              resellerName: ret.resellerName,
              createdAt: formatDate(ret.createdAt),
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
