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

export type BatchFiltersType = {
  arrivalDate?: string
  supplier?: string
}

type BatchFiltersProps = {
  onFilterChange: (filters: BatchFiltersType) => void
  initialFilters?: BatchFiltersType
}

const statusOptions = [
  { value: 'PENDING', label: 'Pendente' },
  { value: 'APPROVED', label: 'Aprovado' },
  { value: 'RETURNED', label: 'Devolvido' },
  { value: 'CANCELLED', label: 'Cancelado' }
]

export function BatchesFilters({
  onFilterChange,
  initialFilters = {}
}: BatchFiltersProps) {
  const [filters, setFilters] = useState<BatchFiltersType>(initialFilters)

  const updateFilter = (key: keyof BatchFiltersType, value: any) => {
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
    <div className="rounded-md border p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium">Filtros</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          disabled={Object.keys(filters).length === 0}
        >
          <X className="mr-2 h-3 w-3" />
          Limpar filtros
        </Button>
      </div>
      <div className="flex gap-4">
        <div className="w-80 space-y-2">
          <label className="block text-xs font-medium">Fornecedor</label>
          <Input
            placeholder="Nome do fornecedor"
            value={filters.supplier || ''}
            onChange={(e) => updateFilter('supplier', e.target.value)}
          />
        </div>
        <div className="w-fit space-y-2">
          <label className="block text-xs font-medium">Data da chegada</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-40 justify-between font-normal"
              >
                {filters.arrivalDate
                  ? new Date(filters.arrivalDate).toLocaleDateString()
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
                  filters.arrivalDate
                    ? new Date(filters.arrivalDate)
                    : undefined
                }
                captionLayout="dropdown"
                onSelect={(date) => {
                  updateFilter(
                    'arrivalDate',
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
