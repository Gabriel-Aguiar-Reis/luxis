'use client'

import { useState } from 'react'
import { toast } from 'sonner'
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
import { Ban } from 'lucide-react'

export function ProductsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const { data: products, isLoading: isLoadingProducts } = useGetProducts()
  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategories()
  const { data: models, isLoading: isLoadingModels } = useGetModels()
  const { mutate: changeProduct } = useChangeProduct(useQueryClient())

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsDialogOpen(true)
  }

  const handleSaveProduct = async (id: string, dto: UpdateProductDto) => {
    changeProduct({ id, dto })
  }

  const isLoading = isLoadingProducts || isLoadingCategories || isLoadingModels

  if (!products || !categories || !models || isLoading) {
    return (
      <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
        <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
          <Ban className="text-primary h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">
          Nenhum produto encontrado!
        </h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Não há produtos registrados no sistema.
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4">
      <ProductsTable
        productModels={models}
        categories={categories}
        isLoading={isLoading}
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
