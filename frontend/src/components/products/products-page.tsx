'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { toast } from 'sonner'
import { ProductDialog } from '@/components/products/product-dialog'
import { ProductFilters } from '@/components/products/product-filters'
import {
  FileEdit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react'
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

type ProductStatus = Product['status']

type ProductFiltersType = {
  serialNumber?: string
  status?: ProductStatus
  categoryId?: string
  modelId?: string
  minPrice?: number
  maxPrice?: number
}

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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)
  const [filters, setFilters] = useState<ProductFiltersType>({})

  const productsPerPage = 10
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

        applyFilters(productsRes, productModels, searchTerm, filters)
      } catch (error) {
        toast.error('Erro ao carregar produtos/modelos')
        console.error(error)
        setProducts([])
        setProductModels([])
        applyFilters([], [], searchTerm, filters)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const applyFilters = (
    products: Product[],
    models: ProductModel[],
    search: string,
    filters: ProductFiltersType
  ) => {
    let filteredProducts = [...products]
    let filteredModels = [...models]

    if (search) {
      const searchLower = search.toLowerCase()
      filteredProducts = filteredProducts.filter((product) =>
        product.serialNumber.value.toLowerCase().includes(searchLower)
      )
    }

    if (filters.serialNumber) {
      filteredProducts = filteredProducts.filter((product) =>
        product.serialNumber.value
          .toLowerCase()
          .includes(filters.serialNumber!.toLowerCase())
      )
    }

    if (filters.status) {
      filteredProducts = filteredProducts.filter(
        (product) => product.status === filters.status
      )
    }

    if (filters.modelId) {
      filteredProducts = filteredProducts.filter(
        (product) => product.modelId === filters.modelId
      )
    }

    if (filters.categoryId) {
      filteredModels = filteredModels.filter(
        (model) => model.categoryId === filters.categoryId
      )
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.modelId &&
          filteredModels.some((m) => m.id === product.modelId)
      )
    }

    setFilteredProducts(filteredProducts)
    setTotalPages(Math.ceil(filteredProducts.length / productsPerPage))
    setCurrentPage(1)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    applyFilters(products, productModels, value, filters)
  }

  const handleFilterChange = (newFilters: ProductFiltersType) => {
    setFilters(newFilters)
    applyFilters(products, productModels, searchTerm, newFilters)
  }

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
      applyFilters(updatedProducts, productModels, searchTerm, filters)

      setIsDialogOpen(false)
    } catch (error) {
      toast.error(`Erro ao ${product.id ? 'atualizar' : 'criar'} produto`)
      console.error(error)
    }
  }

  // Excluir produto
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
      applyFilters(updatedProducts, productModels, searchTerm, filters)
    } catch (error) {
      toast.error('Erro ao excluir produto')
      console.error(error)
    }
  }

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  )

  const formatStatus = (status: ProductStatus) => {
    const statusMap: Record<
      ProductStatus,
      { label: string; className: string }
    > = {
      IN_STOCK: {
        label: 'Em Estoque',
        className: 'bg-[var(--badge-5)] text-[var(--badge-text-5)]'
      },
      ASSIGNED: {
        label: 'Atribuído',
        className: 'bg-[var(--badge-3)] text-[var(--badge-text-3)]'
      },
      SOLD: {
        label: 'Vendido',
        className: 'bg-[var(--badge-4)] text-[var(--badge-text-4)]'
      }
    }
    const { label, className } = statusMap[status] || {
      label: status,
      className: ''
    }
    return (
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${className}`}
      >
        {label}
      </span>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Gerenciamento de Produtos</CardTitle>
              <Button
                variant={isFiltersVisible ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setIsFiltersVisible(!isFiltersVisible)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </div>
            <CardDescription>
              Visualize, edite e exclua produtos do catálogo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isFiltersVisible && (
                <ProductFilters
                  onFilterChange={handleFilterChange}
                  initialFilters={filters}
                  categories={categories}
                  productModels={productModels}
                />
              )}

              {isLoading ? (
                <div className="flex h-[400px] w-full items-center justify-center">
                  <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
                </div>
              ) : (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nº Série</TableHead>
                          <TableHead>Foto</TableHead>
                          <TableHead>Modelo</TableHead>
                          <TableHead>Custo Unitário</TableHead>
                          <TableHead>Preço de Venda</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentProducts.length > 0 ? (
                          currentProducts.map((product) => {
                            const model = productModels.find(
                              (m) => m.id === product.modelId
                            )
                            return (
                              <TableRow key={product.id}>
                                <TableCell className="font-medium">
                                  {product.serialNumber.value}
                                </TableCell>
                                <TableCell>
                                  {model?.photoUrl ? (
                                    <img
                                      src={model.photoUrl.value}
                                      alt={model.name.value}
                                      className="h-10 w-10 rounded object-cover"
                                    />
                                  ) : (
                                    <span className="text-muted-foreground text-xs">
                                      Sem foto
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {model ? model.name.value : '-'}
                                </TableCell>
                                <TableCell>
                                  R$ {product.unitCost.value.replace('.', ',')}
                                </TableCell>
                                <TableCell>
                                  R$ {product.salePrice.value.replace('.', ',')}
                                </TableCell>
                                <TableCell>
                                  {formatStatus(product.status)}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleEditProduct(product)}
                                    >
                                      <FileEdit className="h-4 w-4" />
                                      <span className="sr-only">Editar</span>
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        handleDeleteProduct(product.id)
                                      }
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">Excluir</span>
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                              Nenhum produto encontrado
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Paginação */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Página anterior</span>
                      </Button>
                      <div className="text-sm">
                        Página {currentPage} de {totalPages}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Próxima página</span>
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

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
