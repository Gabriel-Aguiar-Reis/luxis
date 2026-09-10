'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { GetAllOwnershipTransferReturn } from '@/lib/api-types'
import {
  useCreateTransfer,
  useDeleteTransfer,
  useGetTransfers,
  useUpdateTransfer,
  useUpdateTransferStatus
} from '@/hooks/use-transfers'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
import { TransferCreateDialog } from '@/components/transfers/transfer-create-dialog'
import { TransferDeleteDialog } from '@/components/transfers/transfer-delete-dialog'
import { TransferDialog } from '@/components/transfers/transfer-dialog'
import { TransferEditStatusDialog } from '@/components/transfers/transfer-edit-status-dialog'
import { TransfersTable } from '@/components/transfers/transfers-table'
export function TransfersPage() {
  const t = useTranslations('TransfersPage')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditStatusDialogOpen, setIsEditStatusDialogOpen] = useState(false)
  const [selectedTransfer, setSelectedTransfer] = useState<
    GetAllOwnershipTransferReturn[0] | null
  >(null)

  const { data: transfers, isLoading, isError, refetch } = useGetTransfers()

  const { mutate: updateTransfer } = useUpdateTransfer(useQueryClient())
  const { mutate: updateTransferStatus } = useUpdateTransferStatus(
    useQueryClient()
  )
  const { mutate: deleteTransfer } = useDeleteTransfer(useQueryClient())
  const { mutate: createTransfer } = useCreateTransfer(useQueryClient())

  if (isLoading) {
    return <Skeleton className="h-[200px] w-full" />
  }

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />
  }

  if (!transfers || transfers.length === 0) {
    return (
      <EmptyState title={t('emptyTitle')} description={t('emptyDescription')} />
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t('title')}
        </h2>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('newTransfer')}
        </Button>
      </div>
      <TransfersTable
        transfers={transfers}
        onEdit={(transfer) => {
          setSelectedTransfer(transfer)
          setIsDialogOpen(true)
        }}
        onEditStatus={(transfer) => {
          setSelectedTransfer(transfer)
          setIsEditStatusDialogOpen(true)
        }}
        onDelete={(transfer) => {
          setSelectedTransfer(transfer)
          setIsDeleteDialogOpen(true)
        }}
      />
      <TransferDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={(id, dto) => {
          updateTransfer({ id, dto })
        }}
        transfer={selectedTransfer}
      />
      <TransferEditStatusDialog
        isOpen={isEditStatusDialogOpen}
        onClose={() => setIsEditStatusDialogOpen(false)}
        onSave={(id, status) => {
          updateTransferStatus({ id, dto: { status } })
        }}
        transfer={selectedTransfer}
      />
      <TransferDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={(id) => {
          deleteTransfer(id)
        }}
        transfer={selectedTransfer}
      />
      <TransferCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreate={(dto) => {
          createTransfer(dto)
        }}
      />
    </div>
  )
}
