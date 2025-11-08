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
import { SaleStatus } from '@/lib/api-types'
import {
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  FilePen,
  Expand,
  CreditCard,
  DollarSign,
  Zap,
  Repeat,
  CheckLine,
  Coins,
  Download,
  Filter,
  Loader2
} from 'lucide-react'
import { HTMLProps, JSX, useState, createElement } from 'react'
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
import { PhoneNumberUtil } from 'google-libphonenumber'
import {
  GetAllSalesResponse,
  GetOneSaleResponse,
  PaymentMethod
} from '@/hooks/use-sales'
import { SaleProductsList } from '@/components/sales/sale-products-list'
import {
  SalesFilters,
  SalesFiltersType
} from '@/components/sales/sales-filters'
import { toast } from 'sonner'
import * as ReactPDF from '@react-pdf/renderer'
import { SaleReceiptPDF } from '@/components/sales/sale-receipt-pdf/sale-receipt-pdf'

type SalesTableProps = {
  sales: GetAllSalesResponse
  onEdit: (sale: GetOneSaleResponse) => void
  onEditStatus: (sale: GetOneSaleResponse) => void
  onConfirm: (sale: GetOneSaleResponse) => void
  onMarkInstallmentPaid: (sale: GetOneSaleResponse) => void
  onDelete: (sale: GetOneSaleResponse) => void
  phoneUtil: PhoneNumberUtil
  salesPerPage?: number
}

export function SalesTable({
  sales,
  onEdit,
  onEditStatus,
  onConfirm,
  onMarkInstallmentPaid,
  onDelete,
  phoneUtil,
  salesPerPage = 10
}: SalesTableProps) {
  const [filters, setFilters] = useState<SalesFiltersType>({})
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedSale, setSelectedSale] = useState<GetOneSaleResponse | null>(
    null
  )
  const [downloadingSaleId, setDownloadingSaleId] = useState<string | null>(
    null
  )

  const handleDownloadReceipt = async (sale: GetOneSaleResponse) => {
    try {
      setDownloadingSaleId(sale.id)

      // Gerar nome do arquivo com data e hora
      const now = new Date()
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
      const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '')
      const fileName = `comprovante-${dateStr}-${timeStr}-luxis.pdf`

      // Gerar o PDF diretamente do componente
      const element = createElement(SaleReceiptPDF, { sale, phoneUtil })
      // @ts-ignore - O tipo está correto, é um Document do react-pdf
      const asPdf = ReactPDF.pdf(element)
      const blob = await asPdf.toBlob()

      // Criar link de download
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success('Comprovante baixado com sucesso!')
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      toast.error('Erro ao gerar o comprovante')
    } finally {
      setDownloadingSaleId(null)
    }
  }

  const filteredSales = sales.filter((sale) => {
    let match = true
    if (filters.status) {
      match = match && sale.status === filters.status
    }
    if (filters.resellerName) {
      match =
        match &&
        sale.resellerName
          ?.toLowerCase()
          .includes(filters.resellerName.toLowerCase())
    }
    if (filters.saleDate) {
      // Comparar apenas a data (yyyy-MM-dd)
      const filterDate = format(parseISO(filters.saleDate), 'yyyy-MM-dd')
      const createdAt = sale.saleDate
        ? format(new Date(sale.saleDate), 'yyyy-MM-dd')
        : ''
      match = match && createdAt === filterDate
    }

    if (filters.paymentMethod) {
      match = match && sale.paymentMethod === filters.paymentMethod
    }

    if (filters.totalAmountMin !== undefined) {
      match =
        match && parseFloat(sale.totalAmount.value) >= filters.totalAmountMin
    }

    if (filters.totalAmountMax !== undefined) {
      match =
        match && parseFloat(sale.totalAmount.value) <= filters.totalAmountMax
    }
    return match
  })

  const totalPages = Math.max(1, Math.ceil(filteredSales.length / salesPerPage))
  const paginatedSales = filteredSales.slice(
    (currentPage - 1) * salesPerPage,
    currentPage * salesPerPage
  )
  const emptyRows = salesPerPage - paginatedSales.length

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy', { locale: ptBR })
    } catch (error) {
      return 'Data inválida'
    }
  }

  const formatPaymentMethod = (method: keyof typeof PaymentMethod) => {
    const methodMap: Record<PaymentMethod, string> = {
      DEBIT: 'Débito',
      CREDIT: 'Crédito',
      CASH: 'Dinheiro',
      PIX: 'Pix',
      EXCHANGE: 'Troca'
    }

    const baseIconClasses = 'h-4 w-4'
    const iconMap: Record<PaymentMethod, JSX.Element> = {
      DEBIT: (
        <CreditCard
          className={baseIconClasses + 'fill-cyan-100 text-cyan-600'}
        />
      ),
      CREDIT: <CreditCard className={baseIconClasses + ' text-amber-600'} />,
      CASH: <DollarSign className={baseIconClasses + ' text-green-600'} />,
      PIX: <Zap className={baseIconClasses + ' text-blue-600'} />,
      EXCHANGE: <Repeat className={baseIconClasses + ' text-purple-600'} />
    }

    return (
      <span className="inline-flex items-center gap-1">
        {iconMap[method]}
        <span className="leading-none">{methodMap[method]}</span>
      </span>
    )
  }
  const formatStatus = (status: SaleStatus) => {
    const statusMap: Record<
      SaleStatus,
      { label: string; className: HTMLProps<HTMLElement>['className'] }
    > = {
      INSTALLMENTS_OVERDUE: {
        label: 'Parcelas em atraso',
        className: 'bg-badge-3 text-badge-text-3'
      },
      CANCELLED: {
        label: 'Cancelado',
        className: 'bg-badge-6 text-badge-text-6'
      },
      INSTALLMENTS_PAID: {
        label: 'Venda Paga',
        className: 'bg-badge-4 text-badge-text-4'
      },
      PENDING: {
        label: 'Pendente',
        className: 'bg-badge-5 text-badge-text-5'
      },
      INSTALLMENTS_PENDING: {
        label: 'Pgto. Pendente',
        className: 'bg-badge-5 text-badge-text-5'
      },
      CONFIRMED: {
        label: 'Confirmado',
        className: 'bg-badge-2 text-badge-text-2'
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
              <CardTitle>Gerenciamento de Vendas</CardTitle>
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
              Visualize, crie, edite e exclua vendas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isFiltersVisible && (
              <SalesFilters
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
                    <TableHead>Data da Venda</TableHead>
                    <TableHead>Revendedor</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Produtos</TableHead>
                    <TableHead>Método Pgto.</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Parcelas Pagas/Total</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSales.length > 0 ? (
                    <>
                      {paginatedSales.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell>{formatDate(sale.saleDate)}</TableCell>
                          <TableCell>{sale.resellerName}</TableCell>
                          <TableCell>
                            <div>{sale.customerName.value}</div>
                            <div className="text-muted-foreground text-xs font-light">
                              {phoneUtil.formatInOriginalFormat(
                                phoneUtil.parseAndKeepRawInput(
                                  sale.customerPhone.value,
                                  'BR'
                                )
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <SaleProductsList
                              products={sale.products}
                              trigger={
                                <Button className="h-8 w-8" variant="outline">
                                  <Expand className="h-4 w-4" />
                                </Button>
                              }
                            />
                          </TableCell>
                          <TableCell>
                            {formatPaymentMethod(sale.paymentMethod)}
                          </TableCell>
                          <TableCell>{formatStatus(sale.status)}</TableCell>
                          <TableCell>
                            {sale.installmentsInterval.value === 0 &&
                            sale.numberInstallments.value === 1
                              ? 'À vista'
                              : `${sale.installmentsPaid.value} / ${sale.numberInstallments.value}`}
                          </TableCell>
                          <TableCell>
                            R$ {sale.totalAmount.value.replace('.', ',')}
                          </TableCell>

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
                                  onClick={() => onEdit(sale)}
                                  disabled={sale.status !== 'PENDING'}
                                >
                                  <FilePen className="mr-2 h-4 w-4" />
                                  Infos
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => onEditStatus(sale)}
                                  disabled={sale.status === 'INSTALLMENTS_PAID'}
                                >
                                  <FilePen className="mr-2 h-4 w-4" />
                                  Status
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => onConfirm(sale)}
                                  disabled={sale.status !== 'PENDING'}
                                >
                                  <CheckLine className="mr-2 h-4 w-4" />
                                  Confirmar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => onMarkInstallmentPaid(sale)}
                                  disabled={
                                    sale.status !== 'INSTALLMENTS_PENDING' &&
                                    sale.status !== 'INSTALLMENTS_OVERDUE'
                                  }
                                >
                                  <Coins className="mr-2 h-4 w-4" />
                                  Confirmar parcela
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDownloadReceipt(sale)}
                                  disabled={downloadingSaleId === sale.id}
                                >
                                  {downloadingSaleId === sale.id ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Gerando...
                                    </>
                                  ) : (
                                    <>
                                      <Download className="mr-2 h-4 w-4" />
                                      Baixar comprovante
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-text-destructive"
                                  onClick={() => onDelete(sale)}
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
                          <TableCell colSpan={9} style={{ height: 53 }} />
                        </TableRow>
                      ))}
                    </>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                        Nenhuma venda encontrada
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
