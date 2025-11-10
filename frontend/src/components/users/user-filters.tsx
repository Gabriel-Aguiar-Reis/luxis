'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { UserRole, UserStatus } from '@/lib/api-types'

export type UserFiltersType = {
  name?: string
  email?: string
  phone?: string
  role?: UserRole
  status?: UserStatus
}

export type UserFiltersProps = {
  onFilterChange: (filters: UserFiltersType) => void
  initialFilters?: UserFiltersType
}

export function UserFilters({
  onFilterChange,
  initialFilters = {}
}: UserFiltersProps) {
  const [filters, setFilters] = useState<UserFiltersType>(initialFilters)

  const updateFilter = (key: keyof UserFiltersType, value: any) => {
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
    <div className="mb-4 rounded-md border p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between sm:mb-4">
        <h3 className="text-xs font-medium sm:text-sm">Filtros de Usuário</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          disabled={Object.keys(filters).length === 0}
          className="h-8 text-xs sm:h-9 sm:text-sm"
        >
          <X className="mr-1 h-3 w-3 sm:mr-2" />
          <span className="hidden sm:inline">Limpar filtros</span>
          <span className="sm:hidden">Limpar</span>
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
        <div className="space-y-2">
          <Label htmlFor="name-filter" className="text-xs sm:text-sm">
            Nome
          </Label>
          <Input
            id="name-filter"
            type="text"
            placeholder="Buscar por nome"
            value={filters.name || ''}
            onChange={(e) => updateFilter('name', e.target.value)}
            className="h-9 text-xs sm:h-10 sm:text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email-filter" className="text-xs sm:text-sm">
            Email
          </Label>
          <Input
            id="email-filter"
            type="text"
            placeholder="Buscar por email"
            value={filters.email || ''}
            onChange={(e) => updateFilter('email', e.target.value)}
            className="h-9 text-xs sm:h-10 sm:text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone-filter" className="text-xs sm:text-sm">
            Telefone
          </Label>
          <Input
            id="phone-filter"
            type="text"
            placeholder="Buscar por telefone"
            value={filters.phone || ''}
            onChange={(e) => updateFilter('phone', e.target.value)}
            className="h-9 text-xs sm:h-10 sm:text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role-filter" className="text-xs sm:text-sm">
            Função
          </Label>
          <Select
            value={filters.role || ''}
            onValueChange={(value) => updateFilter('role', value || undefined)}
          >
            <SelectTrigger
              className="h-9 w-full text-xs sm:h-10 sm:text-sm"
              id="role-filter"
            >
              <SelectValue placeholder="Todas as funções" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN" className="text-xs sm:text-sm">
                Administrador
              </SelectItem>
              <SelectItem value="RESELLER" className="text-xs sm:text-sm">
                Revendedor
              </SelectItem>
              <SelectItem value="ASSISTANT" className="text-xs sm:text-sm">
                Assistente
              </SelectItem>
              <SelectItem value="UNASSIGNED" className="text-xs sm:text-sm">
                Não Atribuído
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status-filter" className="text-xs sm:text-sm">
            Status
          </Label>
          <Select
            value={filters.status || ''}
            onValueChange={(value) =>
              updateFilter('status', value || undefined)
            }
          >
            <SelectTrigger
              className="h-9 w-full text-xs sm:h-10 sm:text-sm"
              id="status-filter"
            >
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE" className="text-xs sm:text-sm">
                Ativo
              </SelectItem>
              <SelectItem value="DISABLED" className="text-xs sm:text-sm">
                Desativado
              </SelectItem>
              <SelectItem value="PENDING" className="text-xs sm:text-sm">
                Pendente
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
