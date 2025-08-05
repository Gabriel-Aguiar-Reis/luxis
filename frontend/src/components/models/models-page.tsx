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
import { Ban } from 'lucide-react'
import { ModelDeleteDialog } from '@/components/models/model-delete-dialog'

export function ModelsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState<ProductModel | undefined>(
    undefined
  )

  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategories()
  const { data: models, isLoading: isLoadingModels } = useGetModels()

  const { mutate: changeProductModel } = useChangeProductModel()

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

  if (!categories || !models || isLoading) {
    return (
      <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
        <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
          <Ban className="text-primary h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">
          Nenhum modelo encontrado!
        </h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Não há modelos registrados no sistema.
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4">
      <ModelsTable
        models={models}
        categories={categories}
        isLoading={isLoading}
        handleEditModel={handleOpenDialog}
        handleDeleteProductModel={handleDeleteProductModel}
      />

      <ModelDialog
        model={selectedModel}
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
