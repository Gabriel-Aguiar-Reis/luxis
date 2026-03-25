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
import { HTMLProps, JSX, useState } from 'react'
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
import { generateSaleReceiptPdf } from '@/components/sales/generate-sale-receipt-pdf'
import { useLocale, useTranslations } from 'next-intl'

type SalesTableProps = {
  sales: GetAllSalesResponse
  onEdit?: (sale: GetOneSaleResponse) => void
  onEditStatus?: (sale: GetOneSaleResponse) => void
  onConfirm?: (sale: GetOneSaleResponse) => void
  onMarkInstallmentPaid?: (sale: GetOneSaleResponse) => void
  onDelete?: (sale: GetOneSaleResponse) => void
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
  const locale = useLocale()
  const t = useTranslations('SalesTable')
  const tConfirmation = useTranslations('SaleConfirmation')
  const tReceipt = useTranslations('ReceiptPreview')
  const [filters, setFilters] = useState<SalesFiltersType>({})
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedSale, setSelectedSale] = useState<GetOneSaleResponse | null>(
    null
  )
  const [downloadingSaleId, setDownloadingSaleId] = useState<string | null>(
    null
  )
  const dateLocale = locale === 'en' ? enUS : ptBR
  const currencyFormatter = new Intl.NumberFormat(
    locale === 'en' ? 'en-US' : 'pt-BR',
    {
      style: 'currency',
      currency: 'BRL'
    }
  )

  const handleDownloadReceipt = async (sale: GetOneSaleResponse) => {
    try {
      setDownloadingSaleId(sale.id)

      // Gerar nome do arquivo com data e hora
      const now = new Date()
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
      const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '')
      const fileName = `comprovante-${dateStr}-${timeStr}-luxis.pdf`

      const blob = await generateSaleReceiptPdf(sale, phoneUtil, locale, {
        title: tReceipt('pdf.title'),
        saleDate: t('saleDate'),
        customer: tConfirmation('customer'),
        paymentMethod: tConfirmation('paymentMethod'),
        totalProducts: tConfirmation('totalProducts'),
        item: tConfirmation('item'),
        items: tConfirmation('items'),
        installments: tReceipt('pdf.installments'),
        interval: tReceipt('pdf.interval'),
        days: tReceipt('pdf.days'),
        products: t('products'),
        serialNumber: tConfirmation('serialNumber'),
        totalSale: tConfirmation('saleTotal'),
        generatedAt: tReceipt('pdf.generatedAt'),
        at: tReceipt('pdf.at'),
        renderError: tReceipt('pdf.renderError'),
        paymentMethods: {
          CASH: tConfirmation('paymentMethods.CASH'),
          PIX: tConfirmation('paymentMethods.PIX'),
          DEBIT: tConfirmation('paymentMethods.DEBIT'),
          CREDIT: tConfirmation('paymentMethods.CREDIT'),
          EXCHANGE: tConfirmation('paymentMethods.EXCHANGE')
        }
      })

      // Criar link de download
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success(tConfirmation('downloadSuccess'))
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      toast.error(tConfirmation('downloadError'))
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
      return format(parseISO(dateString), 'P', { locale: dateLocale })
    } catch (error) {
      return t('invalidDate')
    }
  }

  const formatPaymentMethod = (method: keyof typeof PaymentMethod) => {
    const methodMap: Record<PaymentMethod, string> = {
      DEBIT: tConfirmation('paymentMethods.DEBIT'),
      CREDIT: tConfirmation('paymentMethods.CREDIT'),
      CASH: tConfirmation('paymentMethods.CASH'),
      PIX: tConfirmation('paymentMethods.PIX'),
      EXCHANGE: tConfirmation('paymentMethods.EXCHANGE')
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
        label: tConfirmation('statuses.INSTALLMENTS_OVERDUE'),
        className: 'bg-badge-3 text-badge-text-3'
      },
      CANCELLED: {
        label: tConfirmation('statuses.CANCELLED'),
        className: 'bg-badge-6 text-badge-text-6'
      },
      INSTALLMENTS_PAID: {
        label: tConfirmation('statuses.INSTALLMENTS_PAID'),
        className: 'bg-badge-4 text-badge-text-4'
      },
      PENDING: {
        label: tConfirmation('statuses.PENDING'),
        className: 'bg-badge-5 text-badge-text-5'
      },
      INSTALLMENTS_PENDING: {
        label: tConfirmation('statuses.INSTALLMENTS_PENDING'),
        className: 'bg-badge-5 text-badge-text-5'
      },
      CONFIRMED: {
        label: tConfirmation('statuses.CONFIRMED'),
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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-lg sm:text-xl">
                {t('managementTitle')}
              </CardTitle>
              <Button
                variant={isFiltersVisible ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                className="w-full sm:w-auto"
              >
                <Filter className="mr-2 h-4 w-4" />
                {t('filters')}
              </Button>
            </div>
            <CardDescription>{t('managementDescription')}</CardDescription>
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
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[100px]">
                      {t('saleDate')}
                    </TableHead>
                    <TableHead className="min-w-[120px]">
                      {t('reseller')}
                    </TableHead>
                    <TableHead className="min-w-[150px]">
                      {t('customer')}
                    </TableHead>
                    <TableHead className="min-w-20">{t('products')}</TableHead>
                    <TableHead className="min-w-[100px]">
                      {t('paymentMethod')}
                    </TableHead>
                    <TableHead className="min-w-[120px]">
                      {t('status')}
                    </TableHead>
                    <TableHead className="min-w-[140px]">
                      {t('installments')}
                    </TableHead>
                    <TableHead className="min-w-[100px]">
                      {t('totalAmount')}
                    </TableHead>
                    <TableHead className="min-w-[100px] text-right">
                      {t('actions')}
                    </TableHead>
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
                              ? t('cashSale')
                              : `${sale.installmentsPaid.value} / ${sale.numberInstallments.value}`}
                          </TableCell>
                          <TableCell>
                            {currencyFormatter.format(
                              Number(sale.totalAmount.value)
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
                                {(onEdit ||
                                  onEditStatus ||
                                  onConfirm ||
                                  onMarkInstallmentPaid) && (
                                  <>
                                    <DropdownMenuLabel>
                                      <div className="flex items-center">
                                        <Pencil className="mr-2 h-4 w-4" />
                                        {t('edit')}
                                      </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                  </>
                                )}
                                {onEdit && (
                                  <DropdownMenuItem
                                    onClick={() => onEdit(sale)}
                                    disabled={sale.status !== 'PENDING'}
                                  >
                                    <FilePen className="mr-2 h-4 w-4" />
                                    {t('info')}
                                  </DropdownMenuItem>
                                )}
                                {onEditStatus && (
                                  <DropdownMenuItem
                                    onClick={() => onEditStatus(sale)}
                                    disabled={
                                      sale.status === 'INSTALLMENTS_PAID'
                                    }
                                  >
                                    <FilePen className="mr-2 h-4 w-4" />
                                    {t('statusAction')}
                                  </DropdownMenuItem>
                                )}
                                {onConfirm && (
                                  <DropdownMenuItem
                                    onClick={() => onConfirm(sale)}
                                    disabled={sale.status !== 'PENDING'}
                                  >
                                    <CheckLine className="mr-2 h-4 w-4" />
                                    {t('confirm')}
                                  </DropdownMenuItem>
                                )}
                                {onMarkInstallmentPaid && (
                                  <DropdownMenuItem
                                    onClick={() => onMarkInstallmentPaid(sale)}
                                    disabled={
                                      sale.status !== 'INSTALLMENTS_PENDING' &&
                                      sale.status !== 'INSTALLMENTS_OVERDUE'
                                    }
                                  >
                                    <Coins className="mr-2 h-4 w-4" />
                                    {t('confirmInstallment')}
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDownloadReceipt(sale)}
                                  disabled={downloadingSaleId === sale.id}
                                >
                                  {downloadingSaleId === sale.id ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      {t('generating')}
                                    </>
                                  ) : (
                                    <>
                                      <Download className="mr-2 h-4 w-4" />
                                      {t('downloadReceipt')}
                                    </>
                                  )}
                                </DropdownMenuItem>
                                {onDelete && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-text-destructive"
                                      onClick={() => onDelete(sale)}
                                      disabled={sale.status !== 'PENDING'}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      {t('delete')}
                                    </DropdownMenuItem>
                                  </>
                                )}
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
                        {t('noSalesFound')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row sm:justify-end">
                <div className="text-sm">
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
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">{t('previousPage')}</span>
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
