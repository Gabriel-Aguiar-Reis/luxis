'use client'

import { useState } from 'react'
import { Ban, Plus } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  GetOneShipmentResponse,
  useCreateShipment,
  useDeleteShipment,
  useGetShipments,
  useUpdateShipment,
  useUpdateShipmentStatus
} from '@/hooks/use-shipments'
import { ShipmentsTable } from '@/components/shipments/shipments-table'
import { ShipmentDialog } from '@/components/shipments/shipments-dialog'
import { ShipmentEditStatusDialog } from '@/components/shipments/shipment-edit-status-dialog'
import { ShipmentDeleteDialog } from '@/components/shipments/shipment-delete-dialog'
import { ShipmentCreateDialog } from '@/components/shipments/shipment-create-dialog'

type ShipmentsPageProps = {
  role?: 'ADMIN' | 'RESELLER'
}

export function ShipmentsPage({ role = 'ADMIN' }: ShipmentsPageProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditStatusDialogOpen, setIsEditStatusDialogOpen] = useState(false)
  const [selectedShipment, setSelectedShipment] =
    useState<GetOneShipmentResponse | null>(null)

  const queryClient = useQueryClient()

  const { data: shipments, isLoading } = useGetShipments()

  const { mutate: updateShipment } = useUpdateShipment(queryClient)
  const { mutate: updateShipmentStatus } = useUpdateShipmentStatus(queryClient)
  const { mutate: deleteShipment } = useDeleteShipment(queryClient)
  const { mutate: createShipment } = useCreateShipment(queryClient)

  // Permissões baseadas no role
  const canCreate = role === 'ADMIN'
  const canEdit = role === 'ADMIN'
  const canDelete = role === 'ADMIN'

  if (!shipments || isLoading) {
    return (
      <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
        <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
          <Ban className="text-primary h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">
          Nenhum romaneio encontrado!
        </h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Não há romaneios registrados no sistema.
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Romaneios</h2>
        {canCreate && (
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Romaneio
          </Button>
        )}
      </div>
      <ShipmentsTable
        shipments={shipments}
        role={role}
        onEdit={
          canEdit
            ? (shipment) => {
                setSelectedShipment(shipment)
                setIsDialogOpen(true)
              }
            : undefined
        }
        onEditStatus={
          canEdit
            ? (shipment) => {
                setSelectedShipment(shipment)
                setIsEditStatusDialogOpen(true)
              }
            : undefined
        }
        onDelete={
          canDelete
            ? (shipment) => {
                setSelectedShipment(shipment)
                setIsDeleteDialogOpen(true)
              }
            : undefined
        }
      />
      <ShipmentDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={(id, dto) => {
          updateShipment({ id, dto })
        }}
        shipment={selectedShipment}
      />
      <ShipmentEditStatusDialog
        isOpen={isEditStatusDialogOpen}
        onClose={() => setIsEditStatusDialogOpen(false)}
        onSave={(id, dto) => {
          updateShipmentStatus({ id, dto })
        }}
        shipment={selectedShipment}
      />
      <ShipmentDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={(id) => {
          deleteShipment(id)
        }}
        shipment={selectedShipment}
      />
      <ShipmentCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreate={(dto) => {
          createShipment(dto)
        }}
      />
    </div>
  )
}
