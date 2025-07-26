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
    <div className="mb-4 rounded-md border p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium">Filtros de Usuário</h3>
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
          <Label htmlFor="name-filter">Nome</Label>
          <Input
            id="name-filter"
            type="text"
            placeholder="Buscar por nome"
            value={filters.name || ''}
            onChange={(e) => updateFilter('name', e.target.value)}
          />
        </div>
        <div className="w-48 space-y-2">
          <Label htmlFor="email-filter">Email</Label>
          <Input
            id="email-filter"
            type="text"
            placeholder="Buscar por email"
            value={filters.email || ''}
            onChange={(e) => updateFilter('email', e.target.value)}
          />
        </div>
        <div className="w-48 space-y-2">
          <Label htmlFor="phone-filter">Telefone</Label>
          <Input
            id="phone-filter"
            type="text"
            placeholder="Buscar por telefone"
            value={filters.phone || ''}
            onChange={(e) => updateFilter('phone', e.target.value)}
          />
        </div>
        <div className="w-48 space-y-2">
          <Label htmlFor="role-filter">Função</Label>
          <Select
            value={filters.role || ''}
            onValueChange={(value) => updateFilter('role', value || undefined)}
          >
            <SelectTrigger className="w-48" id="role-filter">
              <SelectValue placeholder="Todas as funções" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">Administrador</SelectItem>
              <SelectItem value="RESELLER">Revendedor</SelectItem>
              <SelectItem value="ASSISTANT">Assistente</SelectItem>
              <SelectItem value="UNASSIGNED">Não Atribuído</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-48 space-y-2">
          <Label htmlFor="status-filter">Status</Label>
          <Select
            value={filters.status || ''}
            onValueChange={(value) =>
              updateFilter('status', value || undefined)
            }
          >
            <SelectTrigger className="w-48" id="status-filter">
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Ativo</SelectItem>
              <SelectItem value="DISABLED">Desativado</SelectItem>
              <SelectItem value="PENDING">Pendente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
