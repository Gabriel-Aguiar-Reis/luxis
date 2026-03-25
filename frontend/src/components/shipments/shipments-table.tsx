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
import { enUS, ptBR } from 'date-fns/locale'
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
import { useLocale, useTranslations } from 'next-intl'

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
  const locale = useLocale()
  const t = useTranslations('ShipmentsTable')
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
      return format(parseISO(dateString), 'P', {
        locale: locale === 'en' ? enUS : ptBR
      })
    } catch (error) {
      return t('invalidDate')
    }
  }

  const formatStatus = (status: ShipmentStatus) => {
    const statusMap: Record<
      ShipmentStatus,
      { label: string; className: string }
    > = {
      APPROVED: {
        label: t('statuses.APPROVED'),
        className: 'bg-[var(--badge-3)] text-[var(--badge-text-3)]'
      },
      CANCELLED: {
        label: t('statuses.CANCELLED'),
        className: 'bg-[var(--badge-6)] text-[var(--badge-text-6)]'
      },
      DELIVERED: {
        label: t('statuses.DELIVERED'),
        className: 'bg-[var(--badge-4)] text-[var(--badge-text-4)]'
      },
      PENDING: {
        label: t('statuses.PENDING'),
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
      <div className="flex flex-col gap-3 sm:gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-base sm:text-lg md:text-xl">
                {t('managementTitle')}
              </CardTitle>
              <Button
                variant={isFiltersVisible ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                className="w-full text-xs sm:w-auto sm:text-sm"
              >
                <Filter className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                {t('filters')}
              </Button>
            </div>
            <CardDescription className="text-xs sm:text-sm">
              {t('managementDescription')}
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
                    <TableHead className="min-w-[130px] text-xs sm:text-sm">
                      {t('shipmentDate')}
                    </TableHead>
                    <TableHead className="min-w-[150px] text-xs sm:text-sm">
                      {t('reseller')}
                    </TableHead>
                    <TableHead className="min-w-20 text-xs sm:text-sm">
                      {t('products')}
                    </TableHead>
                    <TableHead className="min-w-[100px] text-xs sm:text-sm">
                      {t('status')}
                    </TableHead>
                    {role === 'ADMIN' && (
                      <TableHead className="min-w-[100px] text-right text-xs sm:text-sm">
                        {t('actions')}
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedShipments.length > 0 ? (
                    <>
                      {paginatedShipments.map((shipment) => (
                        <TableRow key={shipment.id}>
                          <TableCell className="text-xs sm:text-sm">
                            {formatDate(shipment.createdAt)}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            {shipment.resellerName}
                          </TableCell>
                          <TableCell>
                            <ShipmentProductsList
                              products={shipment.products}
                              trigger={
                                <Button
                                  className="h-7 w-7 sm:h-8 sm:w-8"
                                  variant="outline"
                                >
                                  <Expand className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                              }
                            />
                          </TableCell>
                          <TableCell>{formatStatus(shipment.status)}</TableCell>

                          {role === 'ADMIN' && (
                            <TableCell className="text-right">
                              <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 sm:h-8 sm:w-8"
                                  >
                                    <Ellipsis className="h-3 w-3 sm:h-4 sm:w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel className="text-xs sm:text-sm">
                                    <div className="flex items-center">
                                      <Pencil className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                      {t('edit')}
                                    </div>
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  {onEdit && (
                                    <DropdownMenuItem
                                      onClick={() => onEdit(shipment)}
                                      disabled={shipment.status !== 'PENDING'}
                                      className="text-xs sm:text-sm"
                                    >
                                      <FilePen className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                      {t('info')}
                                    </DropdownMenuItem>
                                  )}
                                  {onEditStatus && (
                                    <DropdownMenuItem
                                      onClick={() => onEditStatus(shipment)}
                                      className="text-xs sm:text-sm"
                                    >
                                      <FilePen className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                      {t('statusAction')}
                                    </DropdownMenuItem>
                                  )}
                                  {(onEdit || onEditStatus) && onDelete && (
                                    <DropdownMenuSeparator />
                                  )}
                                  {onDelete && (
                                    <DropdownMenuItem
                                      className="text-text-destructive text-xs sm:text-sm"
                                      onClick={() => onDelete(shipment)}
                                    >
                                      <Trash2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                      {t('delete')}
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
                        className="h-24 text-center text-xs sm:text-sm"
                      >
                        {t('noShipmentsFound')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <div className="mt-3 flex flex-col items-center justify-between gap-3 sm:mt-4 sm:flex-row sm:justify-end">
                <div className="text-xs sm:text-sm">
                  {t('page', { current: currentPage, total: totalPages })}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="h-8 text-xs sm:h-9 sm:text-sm"
                  >
                    <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="sr-only">{t('previousPage')}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="h-8 text-xs sm:h-9 sm:text-sm"
                  >
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="sr-only">{t('nextPage')}</span>
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
