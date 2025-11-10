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

interface SaleEditStatusDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, dto: UpdateSaleStatusDto) => void
  sale: GetOneSaleResponse | null
}

const statusOptions: {
  value: SaleStatus
  label: string
  className: string
}[] = [
  {
    value: 'CANCELLED',
    label: 'Cancelado',
    className: 'text-[var(--badge-text-6)]'
  },
  {
    value: 'PENDING',
    label: 'Pendente',
    className: 'text-[var(--badge-text-5)]'
  },
  {
    value: 'CONFIRMED',
    label: 'Confirmado',
    className: 'text-[var(--badge-text-2)]'
  },
  {
    value: 'INSTALLMENTS_OVERDUE',
    label: 'Parcelas atrasadas',
    className: 'text-[var(--badge-text-3)]'
  },
  {
    value: 'INSTALLMENTS_PENDING',
    label: 'Parcelas pendentes',
    className: 'text-[var(--badge-text-4)]'
  },
  {
    value: 'INSTALLMENTS_PAID',
    label: 'Parcelas pagas',
    className: 'text-[var(--badge-text-1)]'
  }
]

export function SaleEditStatusDialog({
  isOpen,
  onClose,
  onSave,
  sale
}: SaleEditStatusDialogProps) {
  const [status, setStatus] = useState<SaleStatus | ''>(sale?.status || '')

  React.useEffect(() => {
    setStatus(sale?.status || '')
  }, [sale])

  if (!sale) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar status da transferência</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as SaleStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
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
            Cancelar
          </Button>
          <Button
            onClick={() => {
              if (status) onSave(sale.id, { status })
              onClose()
            }}
            disabled={!status || status === sale.status}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
