import { ProductFilters } from '@/components/products/product-filters'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table'
import { Category, Product, ProductModel, ProductStatus } from '@/lib/api-types'
import {
  Filter,
  FileEdit,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

type ProductFiltersType = {
  serialNumber?: string
  status?: ProductStatus
  categoryId?: string
  modelId?: string
  minPrice?: number
  maxPrice?: number
}

type ProductsTableProps = {
  productModels: ProductModel[]
  categories: Category[]
  isLoading: boolean
  products: Product[]
  productsPerPage?: number
  handleEditProduct: (product: Product) => void
}

import { useState } from 'react'

export function ProductsTable({
  productModels,
  categories,
  isLoading,
  products,
  productsPerPage = 10,
  handleEditProduct
}: ProductsTableProps) {
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)
  const [filters, setFilters] = useState<ProductFiltersType>({})
  const [currentPage, setCurrentPage] = useState(1)

  const applyFilters = (products: Product[], filters: ProductFiltersType) => {
    let filteredProducts = [...products]
    let filteredModels = [...productModels]

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

    return filteredProducts
  }

  const filteredProducts = applyFilters(products, filters)
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / productsPerPage)
  )
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  )
  const emptyRows = productsPerPage - paginatedProducts.length
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
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg sm:text-xl">
              Gerenciamento de Produtos
            </CardTitle>
            <Button
              variant={isFiltersVisible ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setIsFiltersVisible(!isFiltersVisible)}
              className="w-full sm:w-auto"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>
          <CardDescription>
            Visualize e edite produtos do catálogo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isFiltersVisible && (
              <ProductFilters
                onFilterChange={(newFilters) => {
                  setFilters(newFilters)
                  setCurrentPage(1)
                }}
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
                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[100px]">
                          Nº Série
                        </TableHead>
                        <TableHead className="min-w-20">Foto</TableHead>
                        <TableHead className="min-w-[120px]">Modelo</TableHead>
                        <TableHead className="min-w-[100px]">
                          Custo Unitário
                        </TableHead>
                        <TableHead className="min-w-[100px]">
                          Preço de Venda
                        </TableHead>
                        <TableHead className="min-w-[100px]">Status</TableHead>
                        <TableHead className="min-w-[100px] text-right">
                          Ações
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedProducts.length > 0 ? (
                        <>
                          {paginatedProducts.map((product) => {
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
                                    {/* <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        handleDeleteProduct(product.id)
                                      }
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">Excluir</span>
                                    </Button> */}
                                  </div>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                          {Array.from({
                            length: emptyRows > 0 ? emptyRows : 0
                          }).map((_, idx) => (
                            <TableRow key={`empty-${idx}`}>
                              <TableCell colSpan={7} style={{ height: 57 }} />
                            </TableRow>
                          ))}
                        </>
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            Nenhum produto encontrado
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {totalPages > 1 && (
                  <div className="flex flex-col items-center justify-between gap-3 sm:flex-row sm:justify-end">
                    <div className="text-sm">
                      Página {currentPage} de {totalPages}
                    </div>
                    <div className="flex items-center space-x-2">
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
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
