'use client'

import { useState } from 'react'
import { ModelDialog } from '@/components/models/model-dialog'
import { ProductModel } from '@/lib/api-types'
import { ModelsTable } from '@/components/models/models-table'
import { useGetCategories } from '@/hooks/use-categories'
import {
  UpdateModelDto,
  useChangeProductModel,
  useGetModels
} from '@/hooks/use-product-models'
import { ModelDeleteDialog } from '@/components/models/model-delete-dialog'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
import { BusinessRulesHelp } from '@/components/business-rules/business-rules-help'

export function ModelsPage() {
  const t = useTranslations('ModelsPage')
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState<ProductModel | undefined>(
    undefined
  )

  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    refetch: refetchCategories
  } = useGetCategories()
  const {
    data: models,
    isLoading: isLoadingModels,
    isError: isErrorModels,
    refetch: refetchModels
  } = useGetModels()

  const { mutate: changeProductModel } = useChangeProductModel(queryClient)

  const handleEditModel = (id: string, dto: UpdateModelDto) => {
    changeProductModel({ id, dto })
  }
  const handleDeleteProductModel = (modelId: string) => {
    setSelectedModel(models?.find((model) => model.id === modelId))
    setIsDeleteDialogOpen(true)
  }

  const handleOpenDialog = (model: ProductModel) => {
    setSelectedModel(model)
    setIsDialogOpen(true)
  }

  const isLoading = isLoadingCategories || isLoadingModels
  const isError = isErrorCategories || isErrorModels

  if (isLoading) {
    return <Skeleton className="h-50 w-full" />
  }

  if (isError) {
    return (
      <ErrorState
        onRetry={() => {
          refetchCategories()
          refetchModels()
        }}
      />
    )
  }

  if (!categories || !models) {
    return (
      <EmptyState title={t('emptyTitle')} description={t('emptyDescription')} />
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Modelos</h2>
        <BusinessRulesHelp topic="models" />
      </div>
      <ModelsTable
        models={models}
        categories={categories}
        handleEditModel={handleOpenDialog}
        handleDeleteProductModel={handleDeleteProductModel}
      />

      <ModelDialog
        model={selectedModel}
        categories={categories}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={(id, dto) => handleEditModel(id, dto)}
      />

      <ModelDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        modelId={selectedModel?.id || ''}
      />
    </div>
  )
}
