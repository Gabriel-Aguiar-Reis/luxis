'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Mail, Phone, MapPinHouse } from 'lucide-react'
import { User, UserRole, UserStatus } from '@/lib/api-types'
import { PhoneNumberUtil } from 'google-libphonenumber'

type UserDetailsDialogProps = {
  user: User | null
  isOpen: boolean
  onClose: () => void
  phoneUtil: PhoneNumberUtil
}

export function UserDetailsDialog({
  user,
  isOpen,
  onClose,
  phoneUtil
}: UserDetailsDialogProps) {
  if (!user) return null

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[60vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Usuário</DialogTitle>
          <DialogDescription>
            Informações detalhadas sobre {user.name?.value ?? 'N/A'}{' '}
            {user.surname?.value ?? ''}.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">
              {user.name?.value ?? 'N/A'} {user.surname?.value ?? ''}
            </h3>
            <div className="flex items-center gap-2">
              {formatRole(user.role)}
              {formatStatus(user.status)}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center gap-2">
              <Mail className="text-muted-foreground h-4 w-4" />
              <span>{user.email?.value ?? 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="text-muted-foreground h-4 w-4" />
              <span>
                {user.phone?.value
                  ? phoneUtil.formatInOriginalFormat(
                      phoneUtil.parseAndKeepRawInput(user.phone.value, 'BR')
                    )
                  : 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPinHouse className="text-muted-foreground h-4 w-4" />
              <span>
                {user.residence?.address?.street ?? 'N/A'},{' '}
                {user.residence?.address?.number ?? 'N/A'},{' '}
                {user.residence?.address?.neighborhood ?? 'N/A'} -{' '}
                {user.residence?.address?.city ?? 'N/A'} -{' '}
                {user.residence?.address?.federativeUnit ?? 'N/A'},{' '}
                {user.residence?.address?.postalCode?.value ?? 'N/A'}
              </span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
