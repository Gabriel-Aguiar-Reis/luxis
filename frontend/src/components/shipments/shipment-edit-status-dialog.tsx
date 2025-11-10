import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger
} from '@/components/ui/select'
import { SelectValue } from '@radix-ui/react-select'
import {
  GetOneShipmentResponse,
  ShipmentStatus,
  UpdateShipmentStatusDto
} from '@/hooks/use-shipments'

interface ShipmentEditStatusDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, dto: UpdateShipmentStatusDto) => void
  shipment: GetOneShipmentResponse | null
}

const statusOptions: {
  value: ShipmentStatus
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
    value: 'DELIVERED',
    label: 'Entregue',
    className: 'text-[var(--badge-text-4)]'
  }
]

export function ShipmentEditStatusDialog({
  isOpen,
  onClose,
  onSave,
  shipment
}: ShipmentEditStatusDialogProps) {
  const [status, setStatus] = useState<ShipmentStatus | ''>(
    shipment?.status || ''
  )

  // Atualiza status ao abrir dialog para o valor atual
  React.useEffect(() => {
    setStatus(shipment?.status || '')
  }, [shipment])

  if (!shipment) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            Editar status do romaneio
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-3 sm:space-y-4 sm:py-4">
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as ShipmentStatus)}
          >
            <SelectTrigger className="h-9 text-xs sm:h-10 sm:text-sm">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {statusOptions.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className={`text-xs sm:text-sm ${opt.className}`}
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-row sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full text-xs sm:w-auto sm:text-sm"
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              if (status) onSave(shipment.id, { status })
              onClose()
            }}
            disabled={!status || status === shipment.status}
            className="w-full text-xs sm:w-auto sm:text-sm"
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
