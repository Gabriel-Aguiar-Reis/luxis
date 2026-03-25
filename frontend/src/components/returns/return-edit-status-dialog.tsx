import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ReturnStatus, UpdateReturnStatusDto } from '@/lib/api-types'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger
} from '@/components/ui/select'
import { SelectValue } from '@radix-ui/react-select'
import { GetOneReturnResponse } from '@/hooks/use-returns'
import { useTranslations } from 'next-intl'

interface ReturnEditStatusDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, dto: UpdateReturnStatusDto) => void
  ret: GetOneReturnResponse | null
}

export function ReturnEditStatusDialog({
  isOpen,
  onClose,
  onSave,
  ret
}: ReturnEditStatusDialogProps) {
  const t = useTranslations('ReturnEditStatusDialog')
  const [status, setStatus] = useState<ReturnStatus | ''>(ret?.status || '')
  const statusOptions: {
    value: ReturnStatus
    label: string
    className: string
  }[] = [
    {
      value: 'CANCELLED',
      label: t('statuses.CANCELLED'),
      className: 'text-[var(--badge-text-6)]'
    },
    {
      value: 'PENDING',
      label: t('statuses.PENDING'),
      className: 'text-[var(--badge-text-5)]'
    },
    {
      value: 'APPROVED',
      label: t('statuses.APPROVED'),
      className: 'text-[var(--badge-text-3)]'
    },
    {
      value: 'RETURNED',
      label: t('statuses.RETURNED'),
      className: 'text-[var(--badge-text-4)]'
    }
  ]

  // Atualiza status ao abrir dialog para o valor atual
  React.useEffect(() => {
    setStatus(ret?.status || '')
  }, [ret])

  if (!ret) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as ReturnStatus)}
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
              if (status) onSave(ret.id, { status })
              onClose()
            }}
            disabled={!status || status === ret.status}
          >
            {t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
