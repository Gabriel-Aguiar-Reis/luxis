'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
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
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
import { PhoneNumberUtil } from 'google-libphonenumber'
import { useTranslations } from 'next-intl'

export function SuppliersPage() {
  const t = useTranslations('SuppliersPage')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  )

  const phoneUtil = PhoneNumberUtil.getInstance()

  const { data: suppliers, isLoading, isError, refetch } = useGetSuppliers()
  const { mutate: updateSupplier } = useUpdateSupplier(useQueryClient())
  const { mutate: deleteSupplier } = useDeleteSupplier(useQueryClient())
  const { mutate: createSupplier } = useCreateSupplier(useQueryClient())

  if (isLoading) {
    return <Skeleton className="h-[200px] w-full" />
  }

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />
  }

  if (!suppliers || suppliers.length === 0) {
    return (
      <EmptyState title={t('emptyTitle')} description={t('emptyDescription')} />
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('newSupplier')}
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
