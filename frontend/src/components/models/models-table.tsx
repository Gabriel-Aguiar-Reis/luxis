import { ModelFilters } from '@/components/models/model-filters'
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
import { Category, ProductModel } from '@/lib/api-types'
import { Filter, FileEdit, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

type ModelsFiltersType = {
  id?: string
  name?: string
  categoryName?: string
  suggestedPrice?: string
}

type ModelsTableProps = {
  models: ProductModel[]
  categories: Category[]
  isLoading: boolean
  modelsPerPage?: number
  handleEditModel: (model: ProductModel) => void
}

export function ModelsTable({
  models,
  categories,
  isLoading,
  modelsPerPage = 10,
  handleEditModel
}: ModelsTableProps) {
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)
  const [filters, setFilters] = useState<ModelsFiltersType>({})
  const [currentPage, setCurrentPage] = useState(1)

  const applyFilters = (models: ProductModel[], filters: ModelsFiltersType) => {
    let filteredModels = [...models]

    if (filters.id) {
      filteredModels = filteredModels.filter((model) =>
        model.id.toLowerCase().includes(filters.id!.toLowerCase())
      )
    }

    if (filters.name) {
      filteredModels = filteredModels.filter((model) =>
        model.name.value.toLowerCase().includes(filters.name!.toLowerCase())
      )
    }

    if (filters.categoryName) {
      filteredModels = filteredModels.filter((model) =>
        categories.some((category) =>
          category.name.value
            .toLowerCase()
            .includes(filters.categoryName!.toLowerCase())
        )
      )
    }

    if (filters.suggestedPrice) {
      filteredModels = filteredModels.filter((model) =>
        model.suggestedPrice.value
          .toLowerCase()
          .includes(filters.suggestedPrice!.toLowerCase())
      )
    }
    return filteredModels
  }
  const filteredModels = applyFilters(models, filters)
  const totalPages = Math.max(
    1,
    Math.ceil(filteredModels.length / modelsPerPage)
  )
  const paginatedModels = filteredModels.slice(
    (currentPage - 1) * modelsPerPage,
    currentPage * modelsPerPage
  )
  const emptyRows = modelsPerPage - paginatedModels.length

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Gerenciamento de Modelos de Produtos</CardTitle>
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
            Visualize, edite e exclua modelos do catálogo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isFiltersVisible && (
              <ModelFilters
                onFilterChange={(newFilters) => {
                  setFilters(newFilters)
                  setCurrentPage(1)
                }}
                initialFilters={filters}
                categories={categories}
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
                        <TableHead>Id</TableHead>
                        <TableHead>Foto</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Nome da Categoria</TableHead>
                        <TableHead>Preço Sugerido</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedModels.length > 0 ? (
                        <>
                          {paginatedModels.map((model) => {
                            return (
                              <TableRow key={model.id}>
                                <TableCell className="font-medium">
                                  {model.id}
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
                                <TableCell>{model.name.value}</TableCell>
                                <TableCell>
                                  {
                                    categories.find(
                                      (category) =>
                                        category.id === model.categoryId
                                    )?.name.value
                                  }
                                </TableCell>
                                <TableCell>
                                  R${' '}
                                  {model.suggestedPrice.value.replace('.', ',')}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleEditModel(model)}
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
                            Nenhum modelo encontrado
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

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
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
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
  )
}
