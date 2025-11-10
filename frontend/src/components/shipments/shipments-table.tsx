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
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  FilePen,
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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import {
  GetAllShipmentsResponse,
  GetOneShipmentResponse,
  ShipmentStatus
} from '@/hooks/use-shipments'
import { ShipmentProductsList } from '@/components/shipments/shipment-products-list'
import {
  ShipmentFilters,
  ShipmentFiltersType
} from '@/components/shipments/shipments-filters'

type ShipmentsTableProps = {
  shipments: GetAllShipmentsResponse
  onEdit?: (shipment: GetOneShipmentResponse) => void
  onEditStatus?: (shipment: GetOneShipmentResponse) => void
  onDelete?: (shipment: GetOneShipmentResponse) => void
  shipmentsPerPage?: number
  role?: 'ADMIN' | 'RESELLER'
}

export function ShipmentsTable({
  shipments,
  onEdit,
  onEditStatus,
  onDelete,
  shipmentsPerPage = 10,
  role = 'ADMIN'
}: ShipmentsTableProps) {
  const [filters, setFilters] = useState<ShipmentFiltersType>({})
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const filteredShipments = shipments.filter((shipment) => {
    let match = true
    if (filters.status) {
      match = match && shipment.status === filters.status
    }
    if (filters.reseller) {
      match =
        match &&
        shipment.resellerName
          ?.toLowerCase()
          .includes(filters.reseller.toLowerCase())
    }
    if (filters.createdAt) {
      const filterDate = format(parseISO(filters.createdAt), 'yyyy-MM-dd')
      const createdAt = shipment.createdAt
        ? format(new Date(shipment.createdAt), 'yyyy-MM-dd')
        : ''
      match = match && createdAt === filterDate
    }
    return match
  })

  const totalPages = Math.max(
    1,
    Math.ceil(filteredShipments.length / shipmentsPerPage)
  )
  const paginatedShipments = filteredShipments.slice(
    (currentPage - 1) * shipmentsPerPage,
    currentPage * shipmentsPerPage
  )
  const emptyRows = shipmentsPerPage - paginatedShipments.length

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy', { locale: ptBR })
    } catch (error) {
      return 'Data inválida'
    }
  }

  const formatStatus = (status: ShipmentStatus) => {
    const statusMap: Record<
      ShipmentStatus,
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
      DELIVERED: {
        label: 'Entregue',
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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-lg sm:text-xl">
                Gerenciamento de Romaneios
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
              Visualize, crie, edite e exclua romaneios do catálogo
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isFiltersVisible && (
              <ShipmentFilters
                onFilterChange={(f) => {
                  setFilters(f)
                  setCurrentPage(1)
                }}
                initialFilters={filters}
              />
            )}
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[130px]">
                      Data do romaneio
                    </TableHead>
                    <TableHead className="min-w-[150px]">Revendedor</TableHead>
                    <TableHead className="min-w-20">Produtos</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    {role === 'ADMIN' && (
                      <TableHead className="min-w-[100px] text-right">
                        Ações
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedShipments.length > 0 ? (
                    <>
                      {paginatedShipments.map((shipment) => (
                        <TableRow key={shipment.id}>
                          <TableCell>
                            {formatDate(shipment.createdAt)}
                          </TableCell>
                          <TableCell>{shipment.resellerName}</TableCell>
                          <TableCell>
                            <ShipmentProductsList
                              products={shipment.products}
                              trigger={
                                <Button className="h-8 w-8" variant="outline">
                                  <Expand className="h-4 w-4" />
                                </Button>
                              }
                            />
                          </TableCell>
                          <TableCell>{formatStatus(shipment.status)}</TableCell>

                          {role === 'ADMIN' && (
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
                                  {onEdit && (
                                    <DropdownMenuItem
                                      onClick={() => onEdit(shipment)}
                                      disabled={shipment.status !== 'PENDING'}
                                    >
                                      <FilePen className="mr-2 h-4 w-4" />
                                      Infos
                                    </DropdownMenuItem>
                                  )}
                                  {onEditStatus && (
                                    <DropdownMenuItem
                                      onClick={() => onEditStatus(shipment)}
                                    >
                                      <FilePen className="mr-2 h-4 w-4" />
                                      Status
                                    </DropdownMenuItem>
                                  )}
                                  {(onEdit || onEditStatus) && onDelete && (
                                    <DropdownMenuSeparator />
                                  )}
                                  {onDelete && (
                                    <DropdownMenuItem
                                      className="text-text-destructive"
                                      onClick={() => onDelete(shipment)}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Excluir
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                      {Array.from({
                        length: emptyRows > 0 ? emptyRows : 0
                      }).map((_, idx) => (
                        <TableRow key={`empty-${idx}`}>
                          <TableCell
                            colSpan={role === 'ADMIN' ? 5 : 4}
                            style={{ height: 57 }}
                          />
                        </TableRow>
                      ))}
                    </>
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={role === 'ADMIN' ? 5 : 4}
                        className="h-24 text-center"
                      >
                        Nenhum romaneio encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row sm:justify-end">
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
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Próxima página</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
