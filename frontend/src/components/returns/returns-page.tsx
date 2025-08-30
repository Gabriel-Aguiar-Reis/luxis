'use client'

import { useState } from 'react'
import { Ban, Plus } from 'lucide-react'
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
import { ReturnsTable } from '@/components/returns/returns-table'
import { ReturnEditStatusDialog } from '@/components/returns/return-edit-status-dialog'
import { ReturnDeleteDialog } from '@/components/returns/return-delete-dialog'
import { ReturnDialog } from '@/components/returns/return-dialog'
import { ReturnCreateDialog } from '@/components/returns/return-create-dialog'

export function ReturnsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditStatusDialogOpen, setIsEditStatusDialogOpen] = useState(false)
  const [selectedReturn, setSelectedReturn] =
    useState<GetOneReturnResponse | null>(null)

  const { data: returns, isLoading } = useGetReturns()

  const { mutate: updateReturn } = useUpdateReturn(useQueryClient())
  const { mutate: updateReturnStatus } = useUpdateReturnStatus(useQueryClient())
  const { mutate: deleteReturn } = useDeleteReturn(useQueryClient())
  const { mutate: createReturn } = useCreateReturn(useQueryClient())

  if (!returns || isLoading) {
    return (
      <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
        <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
          <Ban className="text-primary h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">
          Nenhuma devolução encontrada!
        </h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Não há devoluções registradas no sistema.
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Devoluções</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Devolução
        </Button>
      </div>
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
