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
import { PaymentMethod, ReturnStatus, SaleStatus } from '@/lib/api-types'
import { X, ChevronDownIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { ptBR } from 'date-fns/locale'
import { Label } from '@/components/ui/label'

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

const statusOptions: Record<SaleStatus, { value: SaleStatus; label: string }> =
  {
    PENDING: { value: 'PENDING', label: 'Pendente' },
    CANCELLED: { value: 'CANCELLED', label: 'Cancelado' },
    CONFIRMED: { value: 'CONFIRMED', label: 'Confirmado' },
    INSTALLMENTS_OVERDUE: {
      value: 'INSTALLMENTS_OVERDUE',
      label: 'Parcelas atrasadas'
    },
    INSTALLMENTS_PAID: { value: 'INSTALLMENTS_PAID', label: 'Parcelas pagas' },
    INSTALLMENTS_PENDING: {
      value: 'INSTALLMENTS_PENDING',
      label: 'Parcelas pendentes'
    }
  }

const paymentMethodOptions: Record<
  PaymentMethod,
  { value: PaymentMethod; label: string }
> = {
  CREDIT: { value: 'CREDIT', label: 'Cartão de Crédito' },
  DEBIT: { value: 'DEBIT', label: 'Cartão de Débito' },
  PIX: { value: 'PIX', label: 'PIX' },
  CASH: { value: 'CASH', label: 'Dinheiro' },
  EXCHANGE: { value: 'EXCHANGE', label: 'Troca' }
}

export function SalesFilters({
  onFilterChange,
  initialFilters = {}
}: SalesFiltersProps) {
  const [filters, setFilters] = useState<SalesFiltersType>(initialFilters)

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

  return (
    <div className="mb-4 rounded-md border p-4">
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
        <div className="w-80 space-y-2" id="reseller-name-field">
          <Label>Revendedor</Label>
          <Input
            placeholder="Nome do revendedor"
            value={filters.resellerName || ''}
            onChange={(e) => updateFilter('resellerName', e.target.value)}
          />
        </div>
        <div className="w-fit space-y-2" id="status-field">
          <Label>Status</Label>
          <Select
            value={filters.status || ''}
            onValueChange={(v) => updateFilter('status', v || undefined)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
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
        <div className="w-fit space-y-2" id="sale-date-field">
          <Label>Data da venda</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-40 justify-between font-normal"
              >
                {filters.saleDate
                  ? new Date(filters.saleDate).toLocaleDateString()
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
        <div className="w-fit space-y-2" id="payment-method-field">
          <Label>Método de Pagamento</Label>
          <Select
            value={filters.paymentMethod || ''}
            onValueChange={(v) => updateFilter('paymentMethod', v || undefined)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Método de Pagamento" />
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
        <div className="w-fit space-y-2" id="total-amount-min-field">
          <Label>Valor Mínimo (R$)</Label>
          <Input
            type="number"
            placeholder="R$ 0,00"
            step={0.01}
            min={0}
            value={filters.totalAmountMin || ''}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : undefined
              updateFilter('totalAmountMin', value)
            }}
          />
        </div>
        <div className="w-fit space-y-2" id="total-amount-max-field">
          <Label>Valor Máximo (R$)</Label>
          <Input
            type="number"
            placeholder="R$ 0,00"
            step={0.01}
            min={0}
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
