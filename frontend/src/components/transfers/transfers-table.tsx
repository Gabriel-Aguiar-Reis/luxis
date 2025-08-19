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
  GetAllOwnershipTransferReturn,
  OwnershipTransferStatus
} from '@/lib/api-types'
import {
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  FilePen
} from 'lucide-react'
import { useState } from 'react'
import { TransfersFilters, TransfersFiltersType } from './transfers-filters'
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

type TransfersTableProps = {
  transfers: GetAllOwnershipTransferReturn
  onEdit: (transfer: GetAllOwnershipTransferReturn[0]) => void
  onEditStatus: (transfer: GetAllOwnershipTransferReturn[0]) => void
  onDelete: (transfer: GetAllOwnershipTransferReturn[0]) => void
  transfersPerPage?: number
}

export function TransfersTable({
  transfers,
  onEdit,
  onEditStatus,
  onDelete,
  transfersPerPage = 10
}: TransfersTableProps) {
  const [filters, setFilters] = useState<TransfersFiltersType>({})
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const filteredTransfers = transfers.filter((transfer) => {
    let match = true
    if (filters.status) {
      match = match && transfer.status === filters.status
    }
    if (filters.fromReseller) {
      match =
        match &&
        transfer.fromResellerName
          ?.toLowerCase()
          .includes(filters.fromReseller.toLowerCase())
    }
    if (filters.toReseller) {
      match =
        match &&
        transfer.toResellerName
          ?.toLowerCase()
          .includes(filters.toReseller.toLowerCase())
    }
    if (filters.serialNumber) {
      match =
        match &&
        transfer.serialNumber
          ?.toLowerCase()
          .includes(filters.serialNumber.toLowerCase())
    }

    if (filters.transferDate) {
      // Comparar apenas a data (yyyy-MM-dd)
      const filterDate = format(parseISO(filters.transferDate), 'yyyy-MM-dd')
      const transferDate = transfer.transferDate
        ? format(new Date(transfer.transferDate), 'yyyy-MM-dd')
        : ''
      match = match && transferDate === filterDate
    }
    return match
  })

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransfers.length / transfersPerPage)
  )
  const paginatedTransfers = filteredTransfers.slice(
    (currentPage - 1) * transfersPerPage,
    currentPage * transfersPerPage
  )
  const emptyRows = transfersPerPage - paginatedTransfers.length

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR })
    } catch (error) {
      return 'Data inválida'
    }
  }

  const formatStatus = (status: OwnershipTransferStatus) => {
    const statusMap: Record<
      OwnershipTransferStatus,
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
      FINISHED: {
        label: 'Finalizado',
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
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Gerenciamento de Transferências</CardTitle>
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
            Visualize, crie, edite e exclua transferências do catálogo
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isFiltersVisible && (
            <TransfersFilters
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
                  <TableHead>Data da transferência</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Doador</TableHead>
                  <TableHead>Recebedor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransfers.length > 0 ? (
                  <>
                    {paginatedTransfers.map((transfer) => (
                      <TableRow key={transfer.id}>
                        <TableCell>
                          {formatDate(transfer.transferDate)}
                        </TableCell>
                        <TableCell>{transfer.serialNumber}</TableCell>
                        <TableCell>{transfer.fromResellerName}</TableCell>
                        <TableCell>{transfer.toResellerName}</TableCell>
                        <TableCell>{formatStatus(transfer.status)}</TableCell>

                        <TableCell className="text-right">
                          <DropdownMenu>
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
                                onClick={() => onEdit(transfer)}
                              >
                                <FilePen className="mr-2 h-4 w-4" />
                                Infos
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onEditStatus(transfer)}
                              >
                                <FilePen className="mr-2 h-4 w-4" />
                                Status
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-[var(--text-destructive)]"
                                onClick={() => onDelete(transfer)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {Array.from({ length: emptyRows > 0 ? emptyRows : 0 }).map(
                      (_, idx) => (
                        <TableRow key={`empty-${idx}`}>
                          <TableCell colSpan={3} style={{ height: 57 }} />
                        </TableRow>
                      )
                    )}
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Nenhuma transferência encontrada
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
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
  )
}
