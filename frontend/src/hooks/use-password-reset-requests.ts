'use client'

import { toast } from 'sonner'
import { apiFetch } from '@/lib/api-client'
import { apiPaths } from '@/lib/api-paths'
import { PasswordResetRequest } from '@/lib/api-types'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useLocale } from 'next-intl'

export function useGetPasswordResetRequests() {
  return useQuery({
    queryKey: ['password-reset-requests'],
    queryFn: async () => {
      return await apiFetch<PasswordResetRequest[]>(
        apiPaths.auth.passwordResetRequests.base,
        {},
        true
      )
    }
  })
}

export function useApprovePasswordResetRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await apiFetch(
        apiPaths.auth.passwordResetRequests.approve(id),
        {},
        true,
        'PATCH'
      )
    },
    onSuccess: () => {
      toast.success('Solicitação aprovada com sucesso')
      queryClient.invalidateQueries({ queryKey: ['password-reset-requests'] })
    },
    onError: () => {
      toast.error('Falha ao aprovar solicitação')
    }
  })
}

export function useRejectPasswordResetRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await apiFetch(
        apiPaths.auth.passwordResetRequests.reject(id),
        {},
        true,
        'PATCH'
      )
    },
    onSuccess: () => {
      toast.success('Solicitação rejeitada')
      queryClient.invalidateQueries({ queryKey: ['password-reset-requests'] })
    },
    onError: () => {
      toast.error('Falha ao rejeitar solicitação')
    }
  })
}

export function usePasswordResetHelpers() {
  const locale = useLocale()

  const getResetLink = (token: string) => {
    return `${window.location.origin}/${locale}/reset-password/${token}`
  }

  const copyResetLink = async (token: string) => {
    try {
      const link = getResetLink(token)
      await navigator.clipboard.writeText(link)
      toast.success('Link copiado para a área de transferência')
    } catch (error) {
      toast.error('Falha ao copiar link')
    }
  }
  return { getResetLink, copyResetLink }
}
