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
import { ReturnStatus } from '@/lib/api-types'
import {
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  FilePen,
  Expand
} from 'lucide-react'
import { useState } from 'react'
import {
  ReturnFiltersType,
  ReturnsFilters
} from '@/components/returns/returns-filters'
import { Filter } from 'lucide-react'
import { format, parseISO, set } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import {
  GetAllReturnsResponse,
  GetOneReturnResponse
} from '@/hooks/use-returns'
import { useGetProducts } from '@/hooks/use-products'
import { Badge } from '@/components/ui/badge'
import { ReturnProductsList } from '@/components/returns/return-products-list'

type ReturnsTableProps = {
  returns: GetAllReturnsResponse
  onEdit: (ret: GetOneReturnResponse) => void
  onEditStatus: (ret: GetOneReturnResponse) => void
  onDelete: (ret: GetOneReturnResponse) => void
  returnsPerPage?: number
}

export function ReturnsTable({
  returns,
  onEdit,
  onEditStatus,
  onDelete,
  returnsPerPage = 10
}: ReturnsTableProps) {
  const [filters, setFilters] = useState<ReturnFiltersType>({})
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [selectedReturn, setSelectedReturn] =
    useState<GetOneReturnResponse | null>(null)

  const filteredReturns = returns.filter((ret) => {
    let match = true
    if (filters.status) {
      match = match && ret.status === filters.status
    }
    if (filters.reseller) {
      match =
        match &&
        ret.resellerName?.toLowerCase().includes(filters.reseller.toLowerCase())
    }
    if (filters.createdAt) {
      // Comparar apenas a data (yyyy-MM-dd)
      const filterDate = format(parseISO(filters.createdAt), 'yyyy-MM-dd')
      const createdAt = ret.createdAt
        ? format(new Date(ret.createdAt), 'yyyy-MM-dd')
        : ''
      match = match && createdAt === filterDate
    }
    return match
  })

  const totalPages = Math.max(
    1,
    Math.ceil(filteredReturns.length / returnsPerPage)
  )
  const paginatedReturns = filteredReturns.slice(
    (currentPage - 1) * returnsPerPage,
    currentPage * returnsPerPage
  )
  const emptyRows = returnsPerPage - paginatedReturns.length

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy', { locale: ptBR })
    } catch (error) {
      return 'Data inválida'
    }
  }

  const formatStatus = (status: ReturnStatus) => {
    const statusMap: Record<
      ReturnStatus,
      { label: string; className: string }
    > = {
      APPROVED: {
        label: 'Aprovado',
        className: 'bg-[var(--badge-3)] text-[var(--badge-text-3)]'
      },
      CANCELLED: {
        label: 'Cancelado',
        className: 'bg-[var(--badge-6)] text-[var(--badge-text-6)]'
      },
      RETURNED: {
        label: 'Devolvido',
        className: 'bg-[var(--badge-4)] text-[var(--badge-text-4)]'
      },
      PENDING: {
        label: 'Pendente',
        className: 'bg-[var(--badge-5)] text-[var(--badge-text-5)]'
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
    <>
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Gerenciamento de Devoluções</CardTitle>
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
              Visualize, crie, edite e exclua devoluções do catálogo
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isFiltersVisible && (
              <ReturnsFilters
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
                    <TableHead>Data da devolução</TableHead>
                    <TableHead>Revendedor</TableHead>
                    <TableHead>Produtos</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedReturns.length > 0 ? (
                    <>
                      {paginatedReturns.map((ret) => (
                        <TableRow key={ret.id}>
                          <TableCell>{formatDate(ret.createdAt)}</TableCell>
                          <TableCell>{ret.resellerName}</TableCell>
                          <TableCell>
                            <ReturnProductsList
                              products={ret.products}
                              trigger={
                                <Button className="h-8 w-8" variant="outline">
                                  <Expand className="h-4 w-4" />
                                </Button>
                              }
                            />
                          </TableCell>
                          <TableCell>{formatStatus(ret.status)}</TableCell>

                          <TableCell className="text-right">
                            <DropdownMenu modal={false}>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Ellipsis />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                  <div className="flex items-center">
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Editar
                                  </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => onEdit(ret)}
                                  disabled={ret.status !== 'PENDING'}
                                >
                                  <FilePen className="mr-2 h-4 w-4" />
                                  Infos
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => onEditStatus(ret)}
                                >
                                  <FilePen className="mr-2 h-4 w-4" />
                                  Status
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-[var(--text-destructive)]"
                                  onClick={() => onDelete(ret)}
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
                        Nenhuma devolução encontrada
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
      {/* O dialog agora é controlado por trigger, não precisa de instância global */}
    </>
  )
}
