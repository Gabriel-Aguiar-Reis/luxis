'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
import {
  GetOneBatchResponse,
  useDeleteBatch,
  useGetBatches
} from '@/hooks/use-batches'
import { BatchesTable } from '@/components/batches/batches-table'
import { BatchDeleteDialog } from '@/components/batches/batch-delete-dialog'
import { useRouter } from '@/lib/i18n/navigation'

export function BatchesPage() {
  const t = useTranslations('BatchesPage')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedBatch, setSelectedBatch] =
    useState<GetOneBatchResponse | null>(null)

  const { data: batches, isLoading, isError, refetch } = useGetBatches()

  const { mutate: deleteBatch } = useDeleteBatch(useQueryClient())

  const router = useRouter()

  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
        <Button onClick={() => router.push('/home/batches/create')}>
          <Plus className="mr-2 h-4 w-4" />
          {t('newBatch')}
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-50 w-full" />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !batches || batches.length === 0 ? (
        <EmptyState
          title={t('emptyTitle')}
          description={t('emptyDescription')}
        />
      ) : (
        <BatchesTable
          batches={batches}
          onDelete={(batch) => {
            setSelectedBatch(batch)
            setIsDeleteDialogOpen(true)
          }}
        />
      )}

      <BatchDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={(id) => {
          deleteBatch(id)
        }}
        batch={selectedBatch}
      />
    </div>
  )
}
