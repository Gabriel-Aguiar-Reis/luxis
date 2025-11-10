'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'

export type CustomersFiltersType = {
  name?: string
  phone?: string
}

type CustomersFiltersProps = {
  onFilterChange: (filters: CustomersFiltersType) => void
  initialFilters?: CustomersFiltersType
}

export function CustomersFilters({
  onFilterChange,
  initialFilters = {}
}: CustomersFiltersProps) {
  const [filters, setFilters] = useState<CustomersFiltersType>(initialFilters)

  const updateFilter = (key: keyof CustomersFiltersType, value: any) => {
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

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="name-filter">Nome</Label>
          <Input
            id="name-filter"
            type="text"
            placeholder="Nome do cliente"
            value={filters.name || ''}
            onChange={(e) => updateFilter('name', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone-filter">Telefone</Label>
          <Input
            id="phone-filter"
            type="text"
            placeholder="Telefone"
            value={filters.phone || ''}
            onChange={(e) => updateFilter('phone', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
