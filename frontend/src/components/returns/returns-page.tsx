'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  GetOneReturnResponse,
  useCreateReturn,
  useDeleteReturn,
  useGetReturns,
  useUpdateReturn,
  useUpdateReturnStatus
} from '@/hooks/use-returns'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
import { ReturnsTable } from '@/components/returns/returns-table'
import { ReturnEditStatusDialog } from '@/components/returns/return-edit-status-dialog'
import { ReturnDeleteDialog } from '@/components/returns/return-delete-dialog'
import { ReturnDialog } from '@/components/returns/return-dialog'
import { ReturnCreateDialog } from '@/components/returns/return-create-dialog'
import { useTranslations } from 'next-intl'

export function ReturnsPage() {
  const t = useTranslations('ReturnsPage')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditStatusDialogOpen, setIsEditStatusDialogOpen] = useState(false)
  const [selectedReturn, setSelectedReturn] =
    useState<GetOneReturnResponse | null>(null)

  const { data: returns, isLoading, isError, refetch } = useGetReturns()

  const { mutate: updateReturn } = useUpdateReturn(useQueryClient())
  const { mutate: updateReturnStatus } = useUpdateReturnStatus(useQueryClient())
  const { mutate: deleteReturn } = useDeleteReturn(useQueryClient())
  const { mutate: createReturn } = useCreateReturn(useQueryClient())

  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('newReturn')}
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-50 w-full" />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !returns || returns.length === 0 ? (
        <EmptyState
          title={t('emptyTitle')}
          description={t('emptyDescription')}
        />
      ) : (
        <ReturnsTable
          returns={returns}
          onEdit={(ret) => {
            setSelectedReturn(ret)
            setIsDialogOpen(true)
          }}
          onEditStatus={(ret) => {
            setSelectedReturn(ret)
            setIsEditStatusDialogOpen(true)
          }}
          onDelete={(ret) => {
            setSelectedReturn(ret)
            setIsDeleteDialogOpen(true)
          }}
        />
      )}

      <ReturnDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={(id, dto) => {
          updateReturn({ id, dto })
        }}
        ret={selectedReturn}
      />
      <ReturnEditStatusDialog
        isOpen={isEditStatusDialogOpen}
        onClose={() => setIsEditStatusDialogOpen(false)}
        onSave={(id, dto) => {
          updateReturnStatus({ id, dto })
        }}
        ret={selectedReturn}
      />
      <ReturnDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={(id) => {
          deleteReturn(id)
        }}
        ret={selectedReturn}
      />
      <ReturnCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreate={(dto) => {
          createReturn(dto)
        }}
      />
    </div>
  )
}
