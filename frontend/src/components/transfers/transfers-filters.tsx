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
import { OwnershipTransferStatus } from '@/lib/api-types'
import { X, ChevronDownIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { ptBR } from 'date-fns/locale'

export type TransfersFiltersType = {
  status?: OwnershipTransferStatus
  fromReseller?: string
  toReseller?: string
  serialNumber?: string
  transferDate?: string
}

type TransfersFiltersProps = {
  onFilterChange: (filters: TransfersFiltersType) => void
  initialFilters?: TransfersFiltersType
}

const statusOptions = [
  { value: 'PENDING', label: 'Pendente' },
  { value: 'APPROVED', label: 'Aprovado' },
  { value: 'FINISHED', label: 'Finalizado' },
  { value: 'CANCELLED', label: 'Cancelado' }
]

export function TransfersFilters({
  onFilterChange,
  initialFilters = {}
}: TransfersFiltersProps) {
  const [filters, setFilters] = useState<TransfersFiltersType>(initialFilters)

  const updateFilter = (key: keyof TransfersFiltersType, value: any) => {
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
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div className="w-full space-y-2">
          <label className="block text-xs font-medium">Doador</label>
          <Input
            placeholder="Nome do doador"
            value={filters.fromReseller || ''}
            onChange={(e) => updateFilter('fromReseller', e.target.value)}
          />
        </div>
        <div className="w-full space-y-2">
          <label className="block text-xs font-medium">Recebedor</label>
          <Input
            placeholder="Nome do recebedor"
            value={filters.toReseller || ''}
            onChange={(e) => updateFilter('toReseller', e.target.value)}
          />
        </div>
        <div className="w-full space-y-2">
          <label className="block text-xs font-medium">Número de Série</label>
          <Input
            placeholder="Digite o número de série do produto"
            value={filters.serialNumber || ''}
            onChange={(e) => updateFilter('serialNumber', e.target.value)}
          />
        </div>
        <div className="w-full space-y-2">
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
          <label className="block text-xs font-medium">
            Data da Transferência
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-40 justify-between font-normal"
              >
                {filters.transferDate
                  ? new Date(filters.transferDate).toLocaleDateString()
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
                  filters.transferDate
                    ? new Date(filters.transferDate)
                    : undefined
                }
                captionLayout="dropdown"
                onSelect={(date) => {
                  updateFilter(
                    'transferDate',
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
