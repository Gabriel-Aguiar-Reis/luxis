'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { ProductDialog } from '@/components/products/product-dialog'
import {
  Category,
  GetAllCategories,
  GetAllProductModels,
  GetAllProducts,
  Product,
  ProductModel
} from '@/lib/api-types'
import { apiFetch } from '@/lib/api-client'
import { apiPaths } from '@/lib/api-paths'
import { ProductsTable } from '@/components/products/products-table'

type GetAllProductsResponse =
  GetAllProducts['responses']['200']['content']['application/json']

type GetAllProductModelsResponse =
  GetAllProductModels['responses']['200']['content']['application/json']

type GetAllCategoriesResponse =
  GetAllCategories['responses']['200']['content']['application/json']

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [productModels, setProductModels] = useState<ProductModel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const productsRes = await apiFetch<GetAllProductsResponse>(
          apiPaths.products.base,
          {},
          true
        )
        setProducts(productsRes)

        const modelsRes = await apiFetch<GetAllProductModelsResponse>(
          apiPaths.productModels.base,
          {},
          true
        )
        setProductModels(modelsRes)

        const categoriesRes = await apiFetch<GetAllCategoriesResponse>(
          apiPaths.categories.base,
          {},
          true
        )
        setCategories(categoriesRes)
      } catch (error) {
        toast.error('Erro ao carregar produtos/modelos')
        console.error(error)
        setProducts([])
        setProductModels([])
        setCategories([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsDialogOpen(true)
  }

  const handleSaveProduct = async (product: Product) => {
    try {
      const token = localStorage.getItem('accessToken')
      const isNew = !product.id

      const response = await fetch(
        `/api/products${isNew ? '' : `/${product.id}`}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(product)
        }
      )

      toast.success(`Produto ${isNew ? 'criado' : 'atualizado'} com sucesso!`)

      const updatedProducts = products.map((p) =>
        p.id === product.id ? product : p
      )
      setProducts(updatedProducts)
      setIsDialogOpen(false)
    } catch (error) {
      toast.error(`Erro ao ${product.id ? 'atualizar' : 'criar'} produto`)
      console.error(error)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
      return
    }

    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Falha ao excluir produto')
      }

      toast.success('Produto excluído com sucesso!')

      const updatedProducts = products.filter((p) => p.id !== productId)
      setProducts(updatedProducts)
    } catch (error) {
      toast.error('Erro ao excluir produto')
      console.error(error)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4">
      <ProductsTable
        productModels={productModels}
        categories={categories}
        isLoading={isLoading}
        products={products}
        handleEditProduct={handleEditProduct}
        handleDeleteProduct={handleDeleteProduct}
      />

      <ProductDialog
        product={selectedProduct}
        models={productModels}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveProduct}
      />
    </div>
  )
}
