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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar status da transferência</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as ShipmentStatus)}
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
              if (status) onSave(shipment.id, { status })
              onClose()
            }}
            disabled={!status || status === shipment.status}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
