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
import { ptBR } from 'date-fns/locale'

export type ReturnFiltersType = {
  status?: ReturnStatus
  reseller?: string
  createdAt?: string
}

type ReturnFiltersProps = {
  onFilterChange: (filters: ReturnFiltersType) => void
  initialFilters?: ReturnFiltersType
}

const statusOptions = [
  { value: 'PENDING', label: 'Pendente' },
  { value: 'APPROVED', label: 'Aprovado' },
  { value: 'RETURNED', label: 'Devolvido' },
  { value: 'CANCELLED', label: 'Cancelado' }
]

export function ReturnsFilters({
  onFilterChange,
  initialFilters = {}
}: ReturnFiltersProps) {
  const [filters, setFilters] = useState<ReturnFiltersType>(initialFilters)

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
        <h3 className="text-sm font-medium">Filtros</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          disabled={Object.keys(filters).length === 0}
          className="w-full sm:w-auto"
        >
          <X className="mr-2 h-3 w-3" />
          Limpar filtros
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="w-full space-y-2">
          <label className="block text-xs font-medium">Revendedor</label>
          <Input
            placeholder="Nome do revendedor"
            value={filters.reseller || ''}
            onChange={(e) => updateFilter('reseller', e.target.value)}
          />
        </div>
        <div className="w-full space-y-2">
          <label className="block text-xs font-medium">Status</label>
          <Select
            value={filters.status || ''}
            onValueChange={(v) => updateFilter('status', v || undefined)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
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
          <label className="block text-xs font-medium">Data da devolução</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between font-normal"
              >
                {filters.createdAt
                  ? new Date(filters.createdAt).toLocaleDateString()
                  : 'Selecionar data'}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                locale={ptBR}
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
