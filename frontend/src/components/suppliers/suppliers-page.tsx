'use client'

import { useState } from 'react'
import { Ban, Plus } from 'lucide-react'
import { Supplier } from '@/lib/api-types'
import {
  useCreateSupplier,
  useDeleteSupplier,
  useGetSuppliers,
  useUpdateSupplier
} from '@/hooks/use-suppliers'
import { SuppliersTable } from '@/components/suppliers/suppliers-table'
import { SupplierDialog } from '@/components/suppliers/supplier-dialog'
import { useQueryClient } from '@tanstack/react-query'
import { SupplierDeleteDialog } from '@/components/suppliers/supplier-delete-dialog'
import { SupplierCreateDialog } from '@/components/suppliers/supplier-create-dialog'
import { Button } from '@/components/ui/button'
import { PhoneNumberUtil } from 'google-libphonenumber'

export function SuppliersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  )

  const phoneUtil = PhoneNumberUtil.getInstance()

  const { data: suppliers, isLoading } = useGetSuppliers()
  const { mutate: updateSupplier } = useUpdateSupplier(useQueryClient())
  const { mutate: deleteSupplier } = useDeleteSupplier(useQueryClient())
  const { mutate: createSupplier } = useCreateSupplier(useQueryClient())

  if (!suppliers || isLoading) {
    return (
      <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
        <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
          <Ban className="text-primary h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">
          Nenhum fornecedor encontrado!
        </h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Não há fornecedores registrados no sistema.
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Romaneios</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Romaneio
        </Button>
      </div>
      <SuppliersTable
        suppliers={suppliers}
        onEdit={(supplier) => {
          setSelectedSupplier(supplier)
          setIsDialogOpen(true)
        }}
        onDelete={(supplier) => {
          setSelectedSupplier(supplier)
          setIsDeleteDialogOpen(true)
        }}
        onCreate={() => {
          setIsCreateDialogOpen(true)
        }}
        phoneUtil={phoneUtil}
      />
      <SupplierDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={(id, dto) => {
          updateSupplier({ id, dto })
        }}
        supplier={selectedSupplier}
      />
      <SupplierDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={(id) => {
          deleteSupplier(id)
        }}
        supplier={selectedSupplier}
      />
      <SupplierCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreate={(dto) => {
          createSupplier(dto)
        }}
      />
    </div>
  )
}
