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
import { useTranslations } from 'next-intl'

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
  const t = useTranslations('ModelsFilters')
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="model-id-filter" className="text-xs sm:text-sm">
            {t('id')}
          </Label>
          <Input
            id="model-id-filter"
            type="text"
            placeholder={t('idPlaceholder')}
            value={filters.name || ''}
            onChange={(e) => updateFilter('id', e.target.value)}
            className="h-9 text-xs sm:h-10 sm:text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model-name-filter" className="text-xs sm:text-sm">
            {t('modelName')}
          </Label>
          <Input
            id="model-name-filter"
            type="text"
            placeholder={t('modelNamePlaceholder')}
            value={filters.name || ''}
            onChange={(e) => updateFilter('name', e.target.value)}
            className="h-9 text-xs sm:h-10 sm:text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category-filter" className="text-xs sm:text-sm">
            {t('category')}
          </Label>
          <Select
            value={filters.categoryName || ''}
            onValueChange={(value) =>
              updateFilter('categoryName', value || undefined)
            }
          >
            <SelectTrigger
              className="h-9 w-full text-xs sm:h-10 sm:text-sm"
              id="category-filter"
            >
              <SelectValue placeholder={t('allCategories')} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem
                  key={category.id}
                  value={category.id}
                  className="text-xs sm:text-sm"
                >
                  {category.name.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="suggested-price" className="text-xs sm:text-sm">
            {t('suggestedPrice')}
          </Label>
          <Input
            id="suggested-price"
            type="number"
            placeholder={t('pricePlaceholder')}
            step="0.01"
            min="0"
            value={filters.suggestedPrice || ''}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : undefined
              updateFilter('suggestedPrice', value)
            }}
            className="h-9 text-xs sm:h-10 sm:text-sm"
          />
        </div>
      </div>
    </div>
  )
}
