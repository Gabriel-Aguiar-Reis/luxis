'use client'

import { useState } from 'react'
import { ProductDialog } from '@/components/products/product-dialog'
import { Product } from '@/lib/api-types'
import { ProductsTable } from '@/components/products/products-table'
import {
  UpdateProductDto,
  useChangeProduct,
  useGetProducts
} from '@/hooks/use-products'
import { useGetCategories } from '@/hooks/use-categories'
import { useGetModels } from '@/hooks/use-product-models'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'

export function ProductsPage() {
  const t = useTranslations('ProductsPage')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const {
    data: products,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    refetch: refetchProducts
  } = useGetProducts()
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
  const { mutate: changeProduct } = useChangeProduct(useQueryClient())

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsDialogOpen(true)
  }

  const handleSaveProduct = async (id: string, dto: UpdateProductDto) => {
    changeProduct({ id, dto })
  }

  const isLoading = isLoadingProducts || isLoadingCategories || isLoadingModels
  const isError = isErrorProducts || isErrorCategories || isErrorModels

  if (isLoading) {
    return <Skeleton className="h-[200px] w-full" />
  }

  if (isError) {
    return (
      <ErrorState
        onRetry={() => {
          refetchProducts()
          refetchCategories()
          refetchModels()
        }}
      />
    )
  }

  if (!products || !categories || !models) {
    return (
      <EmptyState title={t('emptyTitle')} description={t('emptyDescription')} />
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4">
      <ProductsTable
        productModels={models}
        categories={categories}
        products={products}
        handleEditProduct={handleEditProduct}
      />

      <ProductDialog
        product={selectedProduct}
        models={models}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveProduct}
      />
    </div>
  )
}
