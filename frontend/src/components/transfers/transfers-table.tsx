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
      return format(parseISO(dateString), 'dd/MM/yyyy', { locale: ptBR })
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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg sm:text-xl">
              Gerenciamento de Transferências
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
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[130px]">
                    Data da transferência
                  </TableHead>
                  <TableHead className="min-w-[120px]">Produto</TableHead>
                  <TableHead className="min-w-[120px]">Doador</TableHead>
                  <TableHead className="min-w-[120px]">Recebedor</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[100px] text-right">
                    Ações
                  </TableHead>
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
                                onClick={() => onEdit(transfer)}
                                disabled={transfer.status !== 'PENDING'}
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
                                className="text-text-destructive"
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
                          <TableCell colSpan={6} style={{ height: 57 }} />
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
  )
}
