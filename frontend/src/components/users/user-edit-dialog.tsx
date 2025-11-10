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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            Editar Função do Usuário
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Altere a função do usuário {user?.name?.value ?? 'N/A'}{' '}
            {user?.surname?.value ?? ''}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-3 sm:gap-4 sm:py-4">
          <div className="space-y-2">
            <Label htmlFor="role" className="text-xs sm:text-sm">
              Função
            </Label>
            <Select value={selectedRole} onValueChange={handleRoleChange}>
              <SelectTrigger
                id="role"
                className="h-9 text-xs sm:h-10 sm:text-sm"
              >
                <SelectValue />
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
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-[10px] sm:text-xs">
              {selectedRole === 'ADMIN' &&
                'Administradores têm acesso completo ao sistema.'}
              {selectedRole === 'RESELLER' &&
                'Revendedores podem gerenciar seus produtos, clientes e vendas.'}
              {selectedRole === 'ASSISTANT' &&
                'Assistentes podem ajudar administradores em tarefas específicas.'}
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full text-xs sm:w-auto sm:text-sm"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="w-full text-xs sm:w-auto sm:text-sm"
          >
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
