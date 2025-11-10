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
import { Product, Category, ProductModel } from '@/lib/api-types'

type ProductStatus = Product['status']

type ProductFiltersProps = {
  onFilterChange: (filters: ProductFiltersType) => void
  initialFilters?: ProductFiltersType
  categories: Category[]
  productModels: ProductModel[]
}

type ProductFiltersType = {
  serialNumber?: string
  status?: ProductStatus
  categoryId?: string
  modelId?: string
  minPrice?: number
  maxPrice?: number
}

export function ProductFilters({
  onFilterChange,
  initialFilters = {},
  categories,
  productModels
}: ProductFiltersProps) {
  const [filters, setFilters] = useState<ProductFiltersType>(initialFilters)

  const updateFilter = (key: keyof ProductFiltersType, value: any) => {
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
        <div className="space-y-2">
          <Label htmlFor="serial-number-filter">Número de Série</Label>
          <Input
            id="serial-number-filter"
            type="text"
            placeholder="Digite o número de série"
            value={filters.serialNumber || ''}
            onChange={(e) => updateFilter('serialNumber', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status-filter">Status</Label>
          <Select
            value={filters.status || ''}
            onValueChange={(value) =>
              updateFilter('status', value || undefined)
            }
          >
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IN_STOCK">Em Estoque</SelectItem>
              <SelectItem value="SOLD">Vendido</SelectItem>
              <SelectItem value="ASSIGNED">Atribuído</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category-filter">Categoria</Label>
          <Select
            value={filters.categoryId || ''}
            onValueChange={(value) =>
              updateFilter('categoryId', value || undefined)
            }
          >
            <SelectTrigger id="category-filter">
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

        <div className="space-y-2">
          <Label htmlFor="model-filter">Modelo</Label>
          <Select
            value={filters.modelId || ''}
            onValueChange={(value) =>
              updateFilter('modelId', value || undefined)
            }
          >
            <SelectTrigger id="model-filter">
              <SelectValue placeholder="Todos os modelos" />
            </SelectTrigger>
            <SelectContent>
              {productModels.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="min-price">Preço Mínimo (R$)</Label>
          <Input
            id="min-price"
            type="number"
            placeholder="R$ 0,00"
            step="0.01"
            min="0"
            value={filters.minPrice || ''}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : undefined
              updateFilter('minPrice', value)
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="max-price">Preço Máximo (R$)</Label>
          <Input
            id="max-price"
            type="number"
            placeholder="R$ 0,00"
            step="0.01"
            min="0"
            value={filters.maxPrice || ''}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : undefined
              updateFilter('maxPrice', value)
            }}
          />
        </div>
      </div>
    </div>
  )
}
