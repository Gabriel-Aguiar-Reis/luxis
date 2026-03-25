import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { SaleStatus } from '@/lib/api-types'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger
} from '@/components/ui/select'
import { SelectValue } from '@radix-ui/react-select'
import { GetOneSaleResponse, UpdateSaleStatusDto } from '@/hooks/use-sales'
import { useTranslations } from 'next-intl'

interface SaleEditStatusDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, dto: UpdateSaleStatusDto) => void
  sale: GetOneSaleResponse | null
}

export function SaleEditStatusDialog({
  isOpen,
  onClose,
  onSave,
  sale
}: SaleEditStatusDialogProps) {
  const t = useTranslations('SaleDialogs')
  const tConfirmation = useTranslations('SaleConfirmation')
  const [status, setStatus] = useState<SaleStatus | ''>(sale?.status || '')

  const statusOptions: {
    value: SaleStatus
    label: string
    className: string
  }[] = [
    {
      value: 'CANCELLED',
      label: tConfirmation('statuses.CANCELLED'),
      className: 'text-[var(--badge-text-6)]'
    },
    {
      value: 'PENDING',
      label: tConfirmation('statuses.PENDING'),
      className: 'text-[var(--badge-text-5)]'
    },
    {
      value: 'CONFIRMED',
      label: tConfirmation('statuses.CONFIRMED'),
      className: 'text-[var(--badge-text-2)]'
    },
    {
      value: 'INSTALLMENTS_OVERDUE',
      label: tConfirmation('statuses.INSTALLMENTS_OVERDUE'),
      className: 'text-[var(--badge-text-3)]'
    },
    {
      value: 'INSTALLMENTS_PENDING',
      label: tConfirmation('statuses.INSTALLMENTS_PENDING'),
      className: 'text-[var(--badge-text-4)]'
    },
    {
      value: 'INSTALLMENTS_PAID',
      label: tConfirmation('statuses.INSTALLMENTS_PAID'),
      className: 'text-[var(--badge-text-1)]'
    }
  ]

  React.useEffect(() => {
    setStatus(sale?.status || '')
  }, [sale])

  if (!sale) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('editStatusTitle')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as SaleStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('selectStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {statusOptions.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className={opt.className}
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button
            onClick={() => {
              if (status) onSave(sale.id, { status })
              onClose()
            }}
            disabled={!status || status === sale.status}
          >
            {t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
