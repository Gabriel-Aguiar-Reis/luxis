'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { UserEditDialog } from '@/components/users/user-edit-dialog'
import { UserDetailsDialog } from '@/components/users/user-details-dialog'
import { UserProductsDialog } from '@/components/users/user-products-dialog'
import {
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  UserCog,
  Eye,
  UserX,
  Filter,
  Expand
} from 'lucide-react'
import { User } from '@/lib/api-types'
import { useGetUsers } from '@/hooks/use-users'
import { UserStatusDialog } from '@/components/users/user-status-dialog'
import { PhoneNumberUtil } from 'google-libphonenumber'
import { UserFilters, UserFiltersType } from '@/components/users/user-filters'

type UserRole = User['role']
type UserStatus = User['status']

export function UsersList({ phoneUtil }: { phoneUtil: PhoneNumberUtil }) {
  const { data: users } = useGetUsers()
  const nonPendingUsers = users?.filter((user) => user.role !== 'UNASSIGNED')
  const [filters, setFilters] = useState<UserFiltersType>({})
  const [filteredUsers, setFilteredUsers] = useState<User[]>(
    nonPendingUsers ?? []
  )
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [isProductsDialogOpen, setIsProductsDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)

  const usersPerPage = 10

  useEffect(() => {
    setFilteredUsers(nonPendingUsers || [])
    setTotalPages(Math.ceil((nonPendingUsers || []).length / usersPerPage))
    setCurrentPage(1)

    const applyFilters = (filters: UserFiltersType) => {
      let filtered = nonPendingUsers || []

      if (filters.name) {
        filtered = filtered.filter((user) =>
          user.name.value.toLowerCase().includes(filters.name!.toLowerCase())
        )
      }

      if (filters.email) {
        filtered = filtered.filter((user) =>
          user.email.value.toLowerCase().includes(filters.email!.toLowerCase())
        )
      }

      if (filters.phone) {
        filtered = filtered.filter((user) =>
          user.phone.value.toLowerCase().includes(filters.phone!.toLowerCase())
        )
      }

      if (filters.role) {
        filtered = filtered.filter((user) => user.role === filters.role)
      }

      if (filters.status) {
        filtered = filtered.filter((user) => user.status === filters.status)
      }

      setFilteredUsers(filtered)
      setTotalPages(Math.ceil(filtered.length / usersPerPage))
      setCurrentPage(1)
    }
    applyFilters(filters)
  }, [users, filters])

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }

  const handleViewUserDetails = (user: User) => {
    setSelectedUser(user)
    setIsDetailsDialogOpen(true)
  }

  const handleToggleUserStatus = (user: User) => {
    setSelectedUser(user)
    setIsStatusDialogOpen(true)
  }

  const handleViewUserProducts = (user: User) => {
    setSelectedUser(user)
    setIsProductsDialogOpen(true)
  }

  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  )

  const formatRole = (role: UserRole) => {
    const roleMap: Record<UserRole, { label: string; className: string }> = {
      ADMIN: {
        label: 'Administrador',
        className: 'bg-[var(--badge-1)] text-[var(--badge-text-1)]'
      },
      RESELLER: {
        label: 'Revendedor',
        className: 'bg-[var(--badge-2)] text-[var(--badge-text-2)]'
      },
      ASSISTANT: {
        label: 'Assistente',
        className: 'bg-[var(--badge-3)] text-[var(--badge-text-3)]'
      },
      UNASSIGNED: {
        label: 'Não Atribuído',
        className: 'bg-[var(--badge-5)] text-[var(--badge-text-5)]'
      }
    }

    const { label, className } = roleMap[role] || { label: role, className: '' }

    return (
      <Badge variant="outline" className={className}>
        {label}
      </Badge>
    )
  }

  const formatStatus = (status: UserStatus) => {
    const statusMap: Record<UserStatus, { label: string; className: string }> =
      {
        ACTIVE: {
          label: 'Ativo',
          className: 'bg-[var(--badge-4)] text-[var(--badge-text-4)]'
        },
        DISABLED: {
          label: 'Desativado',
          className: 'bg-[var(--badge-6)] text-[var(--badge-text-6)]'
        },
        PENDING: {
          label: 'Pendente',
          className: 'bg-[var(--badge-5)] text-[var(--badge-text-5)]'
        }
      }

    const { label, className } = statusMap[status] || {
      label: status,
      className: ''
    }

    return (
      <Badge variant="outline" className={className}>
        {label}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Gerenciamento de Usuários</CardTitle>
          <Button
            variant={isFiltersVisible ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
        </div>
        <CardDescription>
          Visualize, edite e gerencie usuários do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isFiltersVisible && (
          <UserFilters
            onFilterChange={(newFilters) => {
              setFilters(newFilters)
              setCurrentPage(1)
            }}
          />
        )}
        <div className="space-y-4">
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Produtos</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentUsers.length > 0 ? (
                    <>
                      {currentUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.name.value} {user.surname.value}
                          </TableCell>
                          <TableCell>{user.email.value}</TableCell>
                          <TableCell>
                            {phoneUtil.formatInOriginalFormat(
                              phoneUtil.parseAndKeepRawInput(
                                user.phone.value,
                                'BR'
                              )
                            )}
                          </TableCell>
                          <TableCell>{formatRole(user.role)}</TableCell>
                          <TableCell>{formatStatus(user.status)}</TableCell>
                          <TableCell>
                            {/* {user.role === 'RESELLER' ? (
                              <Button
                                className="h-8 w-8"
                                variant="outline"
                                size="icon"
                                onClick={() => handleViewUserProducts(user)}
                              >
                                <Expand className="h-4 w-4" />
                              </Button>
                            ) : (
                              <span className="text-muted-foreground text-sm">
                                -
                              </span>
                            )} */}
                            <Button
                              className="h-8 w-8"
                              variant="outline"
                              size="icon"
                              onClick={() => handleViewUserProducts(user)}
                            >
                              <Expand className="h-4 w-4" />
                            </Button>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Abrir menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => handleViewUserDetails(user)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver detalhes
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleEditUser(user)}
                                >
                                  <UserCog className="mr-2 h-4 w-4" />
                                  Editar função
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleToggleUserStatus(user)}
                                  className={
                                    user.status === 'ACTIVE'
                                      ? 'text-text-destructive'
                                      : 'text-text-success'
                                  }
                                >
                                  <UserX className="mr-2 h-4 w-4" />
                                  {user.status === 'ACTIVE'
                                    ? 'Desativar'
                                    : 'Ativar'}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                      {Array.from({
                        length:
                          usersPerPage - currentUsers.length > 0
                            ? usersPerPage - currentUsers.length
                            : 0
                      }).map((_, idx) => (
                        <TableRow key={`empty-${idx}`}>
                          <TableCell colSpan={7} style={{ height: 53 }} />
                        </TableRow>
                      ))}
                    </>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        Nenhum usuário encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Página anterior</span>
                </Button>
                <div className="text-sm">
                  Página {currentPage} de {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Próxima página</span>
                </Button>
              </div>
            )}
          </>
        </div>
      </CardContent>

      <UserEditDialog
        user={selectedUser}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />

      <UserDetailsDialog
        user={selectedUser}
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
        phoneUtil={phoneUtil}
      />

      <UserStatusDialog
        user={selectedUser}
        isOpen={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
      />

      {selectedUser && (
        <UserProductsDialog
          userId={selectedUser.id}
          userName={`${selectedUser.name.value} ${selectedUser.surname.value}`}
          open={isProductsDialogOpen}
          onOpenChange={setIsProductsDialogOpen}
        />
      )}
    </Card>
  )
}
