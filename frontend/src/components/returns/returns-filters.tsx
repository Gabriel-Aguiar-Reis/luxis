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
import { ReturnStatus } from '@/lib/api-types'
import { X, ChevronDownIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { enUS, ptBR } from 'date-fns/locale'
import { useLocale, useTranslations } from 'next-intl'

export type ReturnFiltersType = {
  status?: ReturnStatus
  reseller?: string
  createdAt?: string
}

type ReturnFiltersProps = {
  onFilterChange: (filters: ReturnFiltersType) => void
  initialFilters?: ReturnFiltersType
}

export function ReturnsFilters({
  onFilterChange,
  initialFilters = {}
}: ReturnFiltersProps) {
  const locale = useLocale()
  const t = useTranslations('ReturnsFilters')
  const [filters, setFilters] = useState<ReturnFiltersType>(initialFilters)

  const statusOptions = [
    { value: 'PENDING', label: t('statuses.PENDING') },
    { value: 'APPROVED', label: t('statuses.APPROVED') },
    { value: 'RETURNED', label: t('statuses.RETURNED') },
    { value: 'CANCELLED', label: t('statuses.CANCELLED') }
  ]

  const updateFilter = (key: keyof ReturnFiltersType, value: any) => {
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="w-full space-y-2">
          <label className="block text-xs font-medium">{t('reseller')}</label>
          <Input
            placeholder={t('resellerPlaceholder')}
            value={filters.reseller || ''}
            onChange={(e) => updateFilter('reseller', e.target.value)}
          />
        </div>
        <div className="w-full space-y-2">
          <label className="block text-xs font-medium">{t('status')}</label>
          <Select
            value={filters.status || ''}
            onValueChange={(v) => updateFilter('status', v || undefined)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('status')} />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full space-y-2">
          <label className="block text-xs font-medium">{t('returnDate')}</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between font-normal"
              >
                {filters.createdAt
                  ? new Date(filters.createdAt).toLocaleDateString(locale)
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
