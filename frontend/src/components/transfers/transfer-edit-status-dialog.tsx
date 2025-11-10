import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { OwnershipTransfer, OwnershipTransferStatus } from '@/lib/api-types'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger
} from '@/components/ui/select'
import { SelectValue } from '@radix-ui/react-select'

interface TransferEditStatusDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, status: OwnershipTransferStatus) => void
  transfer: OwnershipTransfer | null
}

const statusOptions: {
  value: OwnershipTransferStatus
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
    value: 'APPROVED',
    label: 'Aprovado',
    className: 'text-[var(--badge-text-3)]'
  },
  {
    value: 'FINISHED',
    label: 'Finalizado',
    className: 'text-[var(--badge-text-4)]'
  }
]

export function TransferEditStatusDialog({
  isOpen,
  onClose,
  onSave,
  transfer
}: TransferEditStatusDialogProps) {
  const [status, setStatus] = useState<OwnershipTransferStatus | ''>(
    transfer?.status || ''
  )

  // Atualiza status ao abrir dialog para o valor atual
  React.useEffect(() => {
    setStatus(transfer?.status || '')
  }, [transfer])

  if (!transfer) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar status da transferência</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as OwnershipTransferStatus)}
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
              if (status) onSave(transfer.id, status)
              onClose()
            }}
            disabled={!status || status === transfer.status}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
