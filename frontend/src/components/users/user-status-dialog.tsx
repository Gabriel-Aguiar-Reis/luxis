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
      <AlertDialogContent className="max-w-[95vw] sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base sm:text-lg">
            Confirmar {user?.status === 'ACTIVE' ? 'desativação' : 'ativação'}{' '}
            de usuário
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs sm:text-sm">
            Tem certeza que deseja{' '}
            {user?.status === 'ACTIVE' ? 'desativar' : 'ativar'} o usuário{' '}
            {user?.name?.value ?? 'N/A'} {user?.surname?.value ?? ''}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-row sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full text-xs sm:w-auto sm:text-sm"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleChange}
            className="w-full text-xs sm:w-auto sm:text-sm"
          >
            Confirmar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
