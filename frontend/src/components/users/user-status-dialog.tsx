import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription
} from '@/components/ui/alert-dialog'
import { User } from '@/lib/api-types'
import { Button } from '@/components/ui/button'
import { useUpdateUserStatus } from '@/hooks/use-users'
import { useQueryClient } from '@tanstack/react-query'

interface UserStatusDialogProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
}

export function UserStatusDialog({
  user,
  isOpen,
  onClose
}: UserStatusDialogProps) {
  const { mutate: updateUserStatus } = useUpdateUserStatus(useQueryClient())

  const handleChange = () => {
    if (!user) return
    updateUserStatus({
      userId: user.id,
      status: user.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE'
    })
    onClose()
  }
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Confirmar {user?.status === 'ACTIVE' ? 'desativação' : 'ativação'}{' '}
            de usuário
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja{' '}
            {user?.status === 'ACTIVE' ? 'desativar' : 'ativar'} o usuário{' '}
            {user?.name.value} {user?.surname.value}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleChange}>
            Confirmar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
