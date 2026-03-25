'use client'

import { toast } from 'sonner'
import { apiFetch } from '@/lib/api-client'
import { apiPaths } from '@/lib/api-paths'
import { PasswordResetRequest } from '@/lib/api-types'
import { queryKeys } from '@/lib/query-keys'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useLocale, useTranslations } from 'next-intl'

export function useGetPasswordResetRequests() {
  return useQuery({
    queryKey: queryKeys.passwordResetRequests.all(),
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
  const t = useTranslations('HookFeedback.passwordReset')
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
      toast.success(t('approveSuccess'))
      queryClient.invalidateQueries({
        queryKey: queryKeys.passwordResetRequests.all()
      })
    },
    onError: () => {
      toast.error(t('approveError'))
    }
  })
}

export function useRejectPasswordResetRequest() {
  const t = useTranslations('HookFeedback.passwordReset')
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
      toast.success(t('rejectSuccess'))
      queryClient.invalidateQueries({
        queryKey: queryKeys.passwordResetRequests.all()
      })
    },
    onError: () => {
      toast.error(t('rejectError'))
    }
  })
}

export function usePasswordResetHelpers() {
  const locale = useLocale()
  const t = useTranslations('HookFeedback.passwordReset')

  const getResetLink = (token: string) => {
    return `${window.location.origin}/${locale}/reset-password/${token}`
  }

  const copyResetLink = async (token: string) => {
    try {
      const link = getResetLink(token)
      await navigator.clipboard.writeText(link)
      toast.success(t('copyLinkSuccess'))
    } catch (error) {
      toast.error(t('copyLinkError'))
    }
  }
  return { getResetLink, copyResetLink }
}
