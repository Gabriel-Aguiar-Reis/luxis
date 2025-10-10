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
import { ptBR } from 'date-fns/locale'
import { ShipmentStatus } from '@/lib/api-types'

export type ShipmentFiltersType = {
  status?: ShipmentStatus
  reseller?: string
  createdAt?: string
}

type ShipmentFiltersProps = {
  onFilterChange: (filters: ShipmentFiltersType) => void
  initialFilters?: ShipmentFiltersType
}

const statusOptions = [
  { value: 'PENDING', label: 'Pendente' },
  { value: 'APPROVED', label: 'Aprovado' },
  { value: 'DELIVERED', label: 'Entregue' },
  { value: 'CANCELLED', label: 'Cancelado' }
]

export function ShipmentFilters({
  onFilterChange,
  initialFilters = {}
}: ShipmentFiltersProps) {
  const [filters, setFilters] = useState<ShipmentFiltersType>(initialFilters)

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
          <label className="block text-xs font-medium">Revendedor</label>
          <Input
            placeholder="Nome do revendedor"
            value={filters.reseller || ''}
            onChange={(e) => updateFilter('reseller', e.target.value)}
          />
        </div>
        <div className="w-fit space-y-2">
          <label className="block text-xs font-medium">Status</label>
          <Select
            value={filters.status || ''}
            onValueChange={(v) => updateFilter('status', v || undefined)}
          >
            <SelectTrigger className="w-40">
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
        <div className="w-fit space-y-2">
          <label className="block text-xs font-medium">Data da devolução</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-40 justify-between font-normal"
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
