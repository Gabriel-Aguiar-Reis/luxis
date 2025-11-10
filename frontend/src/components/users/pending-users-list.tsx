'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
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
import { Check } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import {
  UpdateUserRoleDto,
  useGetPendingUsers,
  useUpdateUserRole,
  useDeleteUser
} from '@/hooks/use-users'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { PhoneNumberUtil } from 'google-libphonenumber'

interface PendingUsersListProps {
  onHandleChange: () => void
  phoneUtil: PhoneNumberUtil
}

export function PendingUsersList({
  onHandleChange,
  phoneUtil
}: PendingUsersListProps) {
  const { data: users, isLoading } = useGetPendingUsers()
  const { mutate: changeUserRole } = useUpdateUserRole(useQueryClient())
  const { mutate: deleteUser } = useDeleteUser(useQueryClient())

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null)

  const handleRoleChange = (dto: UpdateUserRoleDto) => {
    changeUserRole(dto)
    onHandleChange()
  }

  const openDeleteDialog = (userId: string) => {
    setUserIdToDelete(userId)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteUser = () => {
    if (userIdToDelete) {
      deleteUser(userIdToDelete)
      onHandleChange()
      setDeleteDialogOpen(false)
      setUserIdToDelete(null)
    }
  }

  const cancelDeleteUser = () => {
    setDeleteDialogOpen(false)
    setUserIdToDelete(null)
  }

  if (!users || users?.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Aprovações Pendentes</CardTitle>
          <CardDescription>
            Não há novos usuários aguardando aprovação no momento.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-[200px] items-center justify-center">
          <div className="text-muted-foreground">Nenhum usuário pendente</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Aprovações Pendentes</CardTitle>
        <CardDescription>
          Aprove ou rejeite novos usuários que se cadastraram no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[400px] w-full items-center justify-center">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
          </div>
        ) : users.filter((user) => user.status === 'PENDING').length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.name?.value ?? 'N/A'}
                    </TableCell>
                    <TableCell>{user.email?.value ?? 'N/A'}</TableCell>
                    <TableCell>
                      {user.phone?.value
                        ? phoneUtil.formatInOriginalFormat(
                            phoneUtil.parseAndKeepRawInput(
                              user.phone.value,
                              'BR'
                            )
                          )
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            Ações
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aprovar como</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              handleRoleChange({
                                userId: user.id,
                                role: 'ASSISTANT',
                                status: 'ACTIVE'
                              })
                            }
                          >
                            Assistente
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleRoleChange({
                                userId: user.id,
                                role: 'RESELLER',
                                status: 'ACTIVE'
                              })
                            }
                          >
                            Revendedor
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleRoleChange({
                                userId: user.id,
                                role: 'ADMIN',
                                status: 'ACTIVE'
                              })
                            }
                          >
                            Administrador
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(user.id)}
                            className="text-red-600"
                          >
                            Rejeitar (Excluir)
                          </DropdownMenuItem>
                          <Dialog
                            open={deleteDialogOpen}
                            onOpenChange={setDeleteDialogOpen}
                          >
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Confirmar exclusão</DialogTitle>
                                <DialogDescription>
                                  Tem certeza que deseja rejeitar este usuário?
                                  Esta ação não pode ser desfeita.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={cancelDeleteUser}
                                >
                                  Cancelar
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={confirmDeleteUser}
                                >
                                  Excluir usuário
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
              <Check className="text-primary h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">
              Nenhuma aprovação pendente
            </h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Não há novos usuários aguardando aprovação no momento.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
