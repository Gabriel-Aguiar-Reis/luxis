import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GetOneSaleResponse, MarkInstallmentPaidDto } from '@/hooks/use-sales'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

export function SaleMarkInstallmentPaidDialog({
  isOpen,
  onClose,
  onSave,
  sale
}: {
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, dto: MarkInstallmentPaidDto) => void
  sale: GetOneSaleResponse | null
}) {
  const t = useTranslations('SaleDialogs')
  const [installmentNumber, setInstallmentNumber] = useState<number>(1)

  const handleSave = () => {
    if (sale) {
      onSave(sale.id, { installmentNumber })
      onClose()
    }
  }

  useEffect(() => {
    // Define o número de parcelas restantes como padrão
    if (sale) {
      const remaining =
        sale.numberInstallments.value - sale.installmentsPaid.value
      setInstallmentNumber(remaining)
    }
  }, [sale])

  if (!sale) return null

  const alreadyPaid = sale.installmentsPaid.value
  const totalInstallments = sale.numberInstallments.value
  const remaining = totalInstallments - alreadyPaid

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('markInstallmentTitle')}</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            {t.rich('installmentsPaidSummary', {
              paid: alreadyPaid,
              total: totalInstallments,
              strong: (chunks) => <strong>{chunks}</strong>
            })}
            <br />
            {t.rich('remainingSummary', {
              remaining,
              strong: (chunks) => <strong>{chunks}</strong>
            })}
          </AlertDialogDescription>

          <div>
            <Label className="mb-2">{t('howManyInstallments')}</Label>
            <Input
              type="number"
              value={installmentNumber}
              min={1}
              max={remaining}
              onChange={(e) => setInstallmentNumber(Number(e.target.value))}
            />
            <p className="text-muted-foreground mt-2 text-xs">
              {t('installmentProjection', {
                count: installmentNumber,
                totalPaid: alreadyPaid + installmentNumber,
                total: totalInstallments
              })}
            </p>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="secondary" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button variant="default" onClick={handleSave}>
            {t('confirmPayment')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
