'use client'

import { useState } from 'react'
import { Ban, Plus } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  GetOneBatchResponse,
  useDeleteBatch,
  useGetBatches
} from '@/hooks/use-batches'
import { BatchesTable } from '@/components/batches/batches-table'
import { BatchDeleteDialog } from '@/components/batches/batch-delete-dialog'
import { useRouter } from '@/lib/i18n/navigation'

export function BatchesPage() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedBatch, setSelectedBatch] =
    useState<GetOneBatchResponse | null>(null)

  const { data: batches, isLoading } = useGetBatches()

  const { mutate: deleteBatch } = useDeleteBatch(useQueryClient())

  const router = useRouter()

  if (!batches || isLoading) {
    return (
      <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
        <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
          <Ban className="text-primary h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">Nenhum lote encontrado!</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Não há lotes registrados no sistema.
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Lotes de fornecimento
        </h2>
        <Button onClick={() => router.push('/home/batches/create')}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Lote
        </Button>
      </div>
      <BatchesTable
        batches={batches}
        onDelete={(batch) => {
          setSelectedBatch(batch)
          setIsDeleteDialogOpen(true)
        }}
      />
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
