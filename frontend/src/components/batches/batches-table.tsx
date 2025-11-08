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
import {
  Trash2,
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  Expand
} from 'lucide-react'
import { useState } from 'react'
import { Filter } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { GetAllBatchesResponse, GetOneBatchResponse } from '@/hooks/use-batches'
import {
  BatchesFilters,
  BatchFiltersType
} from '@/components/batches/batches-filters'
import { BatchProductsList } from '@/components/batches/batch-products-list'

type BatchesTableProps = {
  batches: GetAllBatchesResponse
  onDelete: (batch: GetOneBatchResponse) => void
  batchesPerPage?: number
}

export function BatchesTable({
  batches,
  onDelete,
  batchesPerPage = 10
}: BatchesTableProps) {
  const [filters, setFilters] = useState<BatchFiltersType>({})
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const filteredBatches = batches.filter((batch) => {
    let match = true
    if (filters.supplier) {
      match =
        match &&
        batch.supplierName
          ?.toLowerCase()
          .includes(filters.supplier.toLowerCase())
    }
    if (filters.arrivalDate) {
      // Comparar apenas a data (yyyy-MM-dd)
      const filterDate = format(parseISO(filters.arrivalDate), 'yyyy-MM-dd')
      const createdAt = batch.arrivalDate
        ? format(new Date(batch.arrivalDate), 'yyyy-MM-dd')
        : ''
      match = match && createdAt === filterDate
    }
    return match
  })

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBatches.length / batchesPerPage)
  )
  const paginatedBatches = filteredBatches.slice(
    (currentPage - 1) * batchesPerPage,
    currentPage * batchesPerPage
  )
  const emptyRows = batchesPerPage - paginatedBatches.length

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy', { locale: ptBR })
    } catch (error) {
      return 'Data inválida'
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Gerenciamento de Lotes</CardTitle>
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
              Visualize, crie, edite e exclua lotes do catálogo
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isFiltersVisible && (
              <BatchesFilters
                onFilterChange={(f) => {
                  setFilters(f)
                  setCurrentPage(1)
                }}
                initialFilters={filters}
              />
            )}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data da chegada</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Produtos</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Custo Total</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedBatches.length > 0 ? (
                    <>
                      {paginatedBatches.map((batch) => (
                        <TableRow key={batch.id}>
                          <TableCell>{formatDate(batch.arrivalDate)}</TableCell>
                          <TableCell>{batch.supplierName}</TableCell>
                          <TableCell>
                            <BatchProductsList
                              products={batch.items}
                              trigger={
                                <Button className="h-8 w-8" variant="outline">
                                  <Expand className="h-4 w-4" />
                                </Button>
                              }
                            />
                          </TableCell>
                          <TableCell>{batch.totalItems}</TableCell>
                          <TableCell>
                            {Number(batch.totalCost.value).toLocaleString(
                              'pt-BR',
                              {
                                style: 'currency',
                                currency: 'BRL'
                              }
                            )}
                          </TableCell>

                          <TableCell className="text-right">
                            <DropdownMenu modal={false}>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Ellipsis />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  className="text-[var(--text-destructive)]"
                                  onClick={() => onDelete(batch)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                      {Array.from({
                        length: emptyRows > 0 ? emptyRows : 0
                      }).map((_, idx) => (
                        <TableRow key={`empty-${idx}`}>
                          <TableCell colSpan={6} style={{ height: 57 }} />
                        </TableRow>
                      ))}
                    </>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Nenhum lote de fornecimento encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-end space-x-2">
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
          </CardContent>
        </Card>
      </div>
    </>
  )
}
