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

export function SaleConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  sale
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: (id: string) => void
  sale: GetOneSaleResponse | null
}) {
  const locale = useLocale()
  const t = useTranslations('SaleDialogs')

  const handleConfirm = () => {
    if (sale) {
      onConfirm(sale.id)
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

  const formatCurrency = (value: number | { value: string }) => {
    const numericValue =
      typeof value === 'number' ? value : parseFloat(value.value)
    return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numericValue)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('confirmTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('confirmWarning')}
            <br />
            <br />
            {t.rich('confirmQuestion', {
              resellerName: sale.resellerName,
              saleDate: formatDate(sale.saleDate),
              totalAmount: formatCurrency(sale.totalAmount),
              strong: (chunks) => <strong>{chunks}</strong>
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="secondary" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button variant="default" onClick={handleConfirm}>
            {t('confirmTitle')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
