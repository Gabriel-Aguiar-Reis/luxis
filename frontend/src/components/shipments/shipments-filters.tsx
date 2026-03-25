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
import { X, ChevronDownIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { enUS, ptBR } from 'date-fns/locale'
import { ShipmentStatus } from '@/lib/api-types'
import { useLocale, useTranslations } from 'next-intl'

export type ShipmentFiltersType = {
  status?: ShipmentStatus
  reseller?: string
  createdAt?: string
}

type ShipmentFiltersProps = {
  onFilterChange: (filters: ShipmentFiltersType) => void
  initialFilters?: ShipmentFiltersType
}

export function ShipmentFilters({
  onFilterChange,
  initialFilters = {}
}: ShipmentFiltersProps) {
  const locale = useLocale()
  const t = useTranslations('ShipmentsFilters')
  const [filters, setFilters] = useState<ShipmentFiltersType>(initialFilters)

  const statusOptions = [
    { value: 'PENDING', label: t('statuses.PENDING') },
    { value: 'APPROVED', label: t('statuses.APPROVED') },
    { value: 'DELIVERED', label: t('statuses.DELIVERED') },
    { value: 'CANCELLED', label: t('statuses.CANCELLED') }
  ]

  const updateFilter = (key: keyof ShipmentFiltersType, value: any) => {
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

  return (
    <div className="rounded-md border p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between sm:mb-4">
        <h3 className="text-xs font-medium sm:text-sm">{t('title')}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          disabled={Object.keys(filters).length === 0}
          className="h-8 text-xs sm:h-9 sm:text-sm"
        >
          <X className="mr-1 h-3 w-3 sm:mr-2" />
          <span className="hidden sm:inline">{t('clearFilters')}</span>
          <span className="sm:hidden">{t('clear')}</span>
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        <div className="space-y-2">
          <label className="block text-xs font-medium">{t('reseller')}</label>
          <Input
            placeholder={t('resellerPlaceholder')}
            value={filters.reseller || ''}
            onChange={(e) => updateFilter('reseller', e.target.value)}
            className="h-9 text-xs sm:h-10 sm:text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-medium">{t('status')}</label>
          <Select
            value={filters.status || ''}
            onValueChange={(v) => updateFilter('status', v || undefined)}
          >
            <SelectTrigger className="h-9 w-full text-xs sm:h-10 sm:text-sm">
              <SelectValue placeholder={t('status')} />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="text-xs sm:text-sm"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-medium">
            {t('shipmentDate')}
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-9 w-full justify-between text-xs font-normal sm:h-10 sm:text-sm"
              >
                <span className="truncate">
                  {filters.createdAt
                    ? new Date(filters.createdAt).toLocaleDateString(locale)
                    : t('selectDate')}
                </span>
                <ChevronDownIcon className="ml-2 h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                locale={locale === 'en' ? enUS : ptBR}
                selected={
                  filters.createdAt ? new Date(filters.createdAt) : undefined
                }
                captionLayout="dropdown"
                onSelect={(date) => {
                  updateFilter(
                    'createdAt',
                    date ? date.toISOString() : undefined
                  )
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}
