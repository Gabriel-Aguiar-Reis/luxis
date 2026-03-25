import { useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { PaymentMethod, SaleStatus } from '@/lib/api-types'
import { X, ChevronDownIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { enUS, ptBR } from 'date-fns/locale'
import { Label } from '@/components/ui/label'
import { useLocale, useTranslations } from 'next-intl'

export type SalesFiltersType = {
  resellerName?: string
  paymentMethod?: string
  saleDate?: string
  status?: SaleStatus
  totalAmountMin?: number
  totalAmountMax?: number
}

type SalesFiltersProps = {
  onFilterChange: (filters: SalesFiltersType) => void
  initialFilters?: SalesFiltersType
}

export function SalesFilters({
  onFilterChange,
  initialFilters = {}
}: SalesFiltersProps) {
  const locale = useLocale()
  const t = useTranslations('SalesFilters')
  const tConfirmation = useTranslations('SaleConfirmation')
  const [filters, setFilters] = useState<SalesFiltersType>(initialFilters)

  const statusOptions: Record<
    SaleStatus,
    { value: SaleStatus; label: string }
  > = {
    PENDING: {
      value: 'PENDING',
      label: tConfirmation('statuses.PENDING')
    },
    CANCELLED: {
      value: 'CANCELLED',
      label: tConfirmation('statuses.CANCELLED')
    },
    CONFIRMED: {
      value: 'CONFIRMED',
      label: tConfirmation('statuses.CONFIRMED')
    },
    INSTALLMENTS_OVERDUE: {
      value: 'INSTALLMENTS_OVERDUE',
      label: tConfirmation('statuses.INSTALLMENTS_OVERDUE')
    },
    INSTALLMENTS_PAID: {
      value: 'INSTALLMENTS_PAID',
      label: tConfirmation('statuses.INSTALLMENTS_PAID')
    },
    INSTALLMENTS_PENDING: {
      value: 'INSTALLMENTS_PENDING',
      label: tConfirmation('statuses.INSTALLMENTS_PENDING')
    }
  }

  const paymentMethodOptions: Record<
    PaymentMethod,
    { value: PaymentMethod; label: string }
  > = {
    CREDIT: {
      value: 'CREDIT',
      label: tConfirmation('paymentMethods.CREDIT')
    },
    DEBIT: {
      value: 'DEBIT',
      label: tConfirmation('paymentMethods.DEBIT')
    },
    PIX: { value: 'PIX', label: tConfirmation('paymentMethods.PIX') },
    CASH: {
      value: 'CASH',
      label: tConfirmation('paymentMethods.CASH')
    },
    EXCHANGE: {
      value: 'EXCHANGE',
      label: tConfirmation('paymentMethods.EXCHANGE')
    }
  }

  const updateFilter = (key: keyof SalesFiltersType, value: any) => {
    const newFilters = { ...filters, [key]: value }
    if (value === '' || value === undefined) {
      delete newFilters[key]
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearAllFilters = () => {
    setFilters({})
    onFilterChange({})
  }

  const calendarLocale = locale === 'en' ? enUS : ptBR

  return (
    <div className="mb-4 rounded-md border p-4">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-medium">{t('title')}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          disabled={Object.keys(filters).length === 0}
          className="w-full sm:w-auto"
        >
          <X className="mr-2 h-3 w-3" />
          {t('clearFilters')}
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:flex xl:flex-wrap">
        <div className="w-full space-y-2 xl:w-80" id="reseller-name-field">
          <Label>{t('reseller')}</Label>
          <Input
            placeholder={t('resellerPlaceholder')}
            value={filters.resellerName || ''}
            onChange={(e) => updateFilter('resellerName', e.target.value)}
          />
        </div>
        <div className="w-full space-y-2 xl:w-fit" id="status-field">
          <Label>{t('status')}</Label>
          <Select
            value={filters.status || ''}
            onValueChange={(v) => updateFilter('status', v || undefined)}
          >
            <SelectTrigger className="w-full xl:w-40">
              <SelectValue placeholder={t('status')} />
            </SelectTrigger>
            <SelectContent>
              {Object.values(statusOptions).map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full space-y-2 xl:w-fit" id="sale-date-field">
          <Label>{t('saleDate')}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between font-normal xl:w-40"
              >
                {filters.saleDate
                  ? new Date(filters.saleDate).toLocaleDateString(locale)
                  : t('selectDate')}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                locale={calendarLocale}
                selected={
                  filters.saleDate ? new Date(filters.saleDate) : undefined
                }
                captionLayout="dropdown"
                onSelect={(date) => {
                  updateFilter(
                    'saleDate',
                    date ? date.toISOString() : undefined
                  )
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="w-full space-y-2 xl:w-fit" id="payment-method-field">
          <Label>{t('paymentMethod')}</Label>
          <Select
            value={filters.paymentMethod || ''}
            onValueChange={(v) => updateFilter('paymentMethod', v || undefined)}
          >
            <SelectTrigger className="w-full xl:w-40">
              <SelectValue placeholder={t('paymentMethod')} />
            </SelectTrigger>
            <SelectContent>
              {Object.values(paymentMethodOptions).map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full space-y-2 xl:w-fit" id="total-amount-min-field">
          <Label>{t('minAmount')}</Label>
          <Input
            type="number"
            placeholder={t('amountPlaceholder')}
            step={0.01}
            min={0}
            className="w-full"
            value={filters.totalAmountMin || ''}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : undefined
              updateFilter('totalAmountMin', value)
            }}
          />
        </div>
        <div className="w-full space-y-2 xl:w-fit" id="total-amount-max-field">
          <Label>{t('maxAmount')}</Label>
          <Input
            type="number"
            placeholder={t('amountPlaceholder')}
            step={0.01}
            min={0}
            className="w-full"
            value={filters.totalAmountMax || ''}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : undefined
              updateFilter('totalAmountMax', value)
            }}
          />
        </div>
      </div>
    </div>
  )
}
