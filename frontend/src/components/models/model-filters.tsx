'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'
import { Category, ProductModel } from '@/lib/api-types'

type ModelFilterProp = {
  onFilterChange: (filters: ModelFiltersType) => void
  initialFilters?: ModelFiltersType
  categories: Category[]
}

type ModelFiltersType = {
  id?: string
  name?: string
  categoryName?: string
  suggestedPrice?: string
}

export function ModelFilters({
  onFilterChange,
  initialFilters = {},
  categories
}: ModelFilterProp) {
  const [filters, setFilters] = useState<ModelFiltersType>(initialFilters)

  const updateFilter = (key: keyof ModelFiltersType, value: any) => {
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

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <div className="w-48 space-y-2">
          <Label htmlFor="model-id-filter">Id</Label>
          <Input
            id="model-id-filter"
            type="text"
            placeholder="Digite o Id do modelo"
            value={filters.name || ''}
            onChange={(e) => updateFilter('id', e.target.value)}
          />
        </div>
        <div className="w-48 space-y-2">
          <Label htmlFor="model-name-filter">Nome do Modelo</Label>
          <Input
            id="model-name-filter"
            type="text"
            placeholder="Digite o nome do modelo"
            value={filters.name || ''}
            onChange={(e) => updateFilter('name', e.target.value)}
          />
        </div>
        <div className="w-48 space-y-2">
          <Label htmlFor="category-filter">Categoria</Label>
          <Select
            value={filters.categoryName || ''}
            onValueChange={(value) =>
              updateFilter('categoryName', value || undefined)
            }
          >
            <SelectTrigger className="w-48" id="category-filter">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-48 space-y-2">
          <Label htmlFor="suggested-price">Preço Sugerido (R$)</Label>
          <Input
            id="suggested-price"
            type="number"
            placeholder="R$ 0,00"
            step="0.01"
            min="0"
            value={filters.suggestedPrice || ''}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : undefined
              updateFilter('suggestedPrice', value)
            }}
          />
        </div>
      </div>
    </div>
  )
}
