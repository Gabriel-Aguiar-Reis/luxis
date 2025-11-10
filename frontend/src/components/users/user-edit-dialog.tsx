'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { User } from '@/lib/api-types'
import { useUpdateUserRole } from '@/hooks/use-users'
import { useQueryClient } from '@tanstack/react-query'

type UserRole = User['role']

type UserDialogProps = {
  user: User | null
  isOpen: boolean
  onClose: () => void
}

export function UserEditDialog({ user, isOpen, onClose }: UserDialogProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    user?.role || 'RESELLER'
  )

  const { mutate: updateUserRole } = useUpdateUserRole(useQueryClient())

  const handleRoleChange = (value: string) => {
    setSelectedRole(value as UserRole)
  }

  const handleSave = () => {
    if (!user) return

    updateUserRole({
      userId: user.id,
      role: selectedRole,
      status: user.status
    })

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Função do Usuário</DialogTitle>
          <DialogDescription>
            Altere a função do usuário {user?.name?.value ?? 'N/A'}{' '}
            {user?.surname?.value ?? ''}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="role">Função</Label>
            <Select value={selectedRole} onValueChange={handleRoleChange}>
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Administrador</SelectItem>
                <SelectItem value="RESELLER">Revendedor</SelectItem>
                <SelectItem value="ASSISTANT">Assistente</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-xs">
              {selectedRole === 'ADMIN' &&
                'Administradores têm acesso completo ao sistema.'}
              {selectedRole === 'RESELLER' &&
                'Revendedores podem gerenciar seus produtos, clientes e vendas.'}
              {selectedRole === 'ASSISTANT' &&
                'Assistentes podem ajudar administradores em tarefas específicas.'}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave}>
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
