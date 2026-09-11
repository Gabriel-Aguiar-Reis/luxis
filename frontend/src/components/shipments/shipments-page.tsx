'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
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
import { useTranslations } from 'next-intl'

type ShipmentsPageProps = {
  role?: 'ADMIN' | 'RESELLER'
}

export function ShipmentsPage({ role = 'ADMIN' }: ShipmentsPageProps) {
  const t = useTranslations('ShipmentsPage')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditStatusDialogOpen, setIsEditStatusDialogOpen] = useState(false)
  const [selectedShipment, setSelectedShipment] =
    useState<GetOneShipmentResponse | null>(null)

  const queryClient = useQueryClient()

  const { data: shipments, isLoading, isError, refetch } = useGetShipments()

  const { mutate: updateShipment } = useUpdateShipment(queryClient)
  const { mutate: updateShipmentStatus } = useUpdateShipmentStatus(queryClient)
  const { mutate: deleteShipment } = useDeleteShipment(queryClient)
  const { mutate: createShipment } = useCreateShipment(queryClient)

  // Permissões baseadas no role
  const canCreate = role === 'ADMIN'
  const canEdit = role === 'ADMIN'
  const canDelete = role === 'ADMIN'

  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
        {canCreate && (
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('newShipment')}
          </Button>
        )}
      </div>

      {isLoading ? (
        <Skeleton className="h-50 w-full" />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !shipments || shipments.length === 0 ? (
        <EmptyState
          title={t('emptyTitle')}
          description={t('emptyDescription')}
        />
      ) : (
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
      )}

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
