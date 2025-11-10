'use client'

import { useEffect } from 'react'
import {
  useGetPasswordResetRequests,
  useApprovePasswordResetRequest,
  useRejectPasswordResetRequest,
  usePasswordResetHelpers
} from '@/hooks/use-password-reset-requests'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, X, Copy, Loader2 } from 'lucide-react'
import { PasswordResetRequestStatus } from '@/lib/api-types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function PasswordResetRequestsList() {
  const { data: requests, isLoading } = useGetPasswordResetRequests()
  const { mutate: approveRequest } = useApprovePasswordResetRequest()
  const { mutate: rejectRequest } = useRejectPasswordResetRequest()
  const { copyResetLink } = usePasswordResetHelpers()

  const getStatusBadge = (status: PasswordResetRequestStatus) => {
    const variants: Record<
      PasswordResetRequestStatus,
      {
        variant: 'default' | 'secondary' | 'destructive' | 'outline'
        label: string
      }
    > = {
      PENDING: {
        variant: 'outline',
        label: 'Pendente'
      },
      APPROVED: {
        variant: 'default',
        label: 'Aprovada'
      },
      REJECTED: {
        variant: 'destructive',
        label: 'Rejeitada'
      },
      COMPLETED: {
        variant: 'secondary',
        label: 'Concluída'
      }
    }

    return (
      <Badge variant={variants[status].variant}>{variants[status].label}</Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground">
          Nenhuma solicitação de redefinição de senha
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {requests.map((request, index) => (
        <Card key={`${request.id}-${index}`}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-base">{request.username}</CardTitle>
              {getStatusBadge(request.status)}
            </div>
            <CardDescription>Permitir redefinição de senha</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground">
                <span className="font-medium">Email:</span>{' '}
                {request.email?.value ?? 'N/A'}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Telefone:</span>{' '}
                {request.phone?.value ?? 'N/A'}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Data:</span>{' '}
                {format(new Date(request.createdAt), "dd/MM/yyyy 'às' HH:mm", {
                  locale: ptBR
                })}
              </p>
            </div>

            {request.status === 'APPROVED' && (
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => copyResetLink(request.token)}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar Link de Redefinição
                </Button>
              </div>
            )}

            {request.status === 'PENDING' && (
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1"
                  onClick={() => approveRequest(request.id)}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Aprovar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => rejectRequest(request.id)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Negar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
