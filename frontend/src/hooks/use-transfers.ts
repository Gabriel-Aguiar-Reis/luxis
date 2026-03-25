import { useQuery, useMutation, QueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api-client'
import {
  DeleteOwnershipTransfer,
  GetAllOwnershipTransfers,
  PostOwnershipTransfer,
  UpdateOwnershipTransfer,
  UpdateOwnershipTransferStatus,
  UpdateOwnershipTransferStatusDto
} from '@/lib/api-types'
import { apiPaths } from '@/lib/api-paths'
import { queryKeys } from '@/lib/query-keys'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { components } from '@/types/openapi'

type GetAllTransfersResponse =
  GetAllOwnershipTransfers['responses']['200']['content']['application/json']

export type CreateTransferDto =
  components['schemas']['CreateOwnershipTransferDto']

type CreateTransferResponse =
  PostOwnershipTransfer['responses']['201']['content']['application/json']

type DeleteTransferResponse =
  DeleteOwnershipTransfer['responses']['204']['content']

export type UpdateTransferDto =
  UpdateOwnershipTransfer['requestBody']['content']['application/json']

type UpdateTransferResponse =
  UpdateOwnershipTransfer['responses']['200']['content']['application/json']

export type UpdateTransferStatusDto = UpdateOwnershipTransferStatusDto

export type UpdateTransferStatusResponse =
  UpdateOwnershipTransferStatus['responses']['200']['content']

export function useGetTransfers() {
  return useQuery({
    queryKey: queryKeys.transfers.all(),
    queryFn: async () => {
      return await apiFetch<GetAllTransfersResponse>(
        apiPaths.ownershipTransfers.base,
        {},
        true
      )
    },
    staleTime: 5 * 60 * 1000
  })
}

export function useCreateTransfer(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.transfers')

  return useMutation({
    mutationFn: async (newTransfer: CreateTransferDto) => {
      return await apiFetch<CreateTransferResponse>(
        apiPaths.ownershipTransfers.base,
        {
          body: JSON.stringify(newTransfer)
        },
        true,
        'POST'
      )
    },
    onSuccess: () => {
      toast.success(t('createSuccess'))
      queryClient.invalidateQueries({ queryKey: queryKeys.transfers.all() })
    },
    onError: (error) => {
      toast.error(
        t('createError', { message: error.message || t('unexpectedError') })
      )
    }
  })
}

export function useDeleteTransfer(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.transfers')

  return useMutation({
    mutationFn: async (transferId: string) => {
      return await apiFetch<DeleteTransferResponse>(
        `${apiPaths.ownershipTransfers.base}/${transferId}`,
        {},
        true,
        'DELETE'
      )
    },
    onSuccess: () => {
      toast.success(t('deleteSuccess'))
      queryClient.invalidateQueries({ queryKey: queryKeys.transfers.all() })
    },
    onError: (error) => {
      toast.error(
        t('deleteError', { message: error.message || t('unexpectedError') })
      )
    }
  })
}

export function useUpdateTransfer(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.transfers')

  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateTransferDto }) => {
      return await apiFetch<UpdateTransferResponse>(
        `${apiPaths.ownershipTransfers.byId(id)}`,
        {
          body: JSON.stringify(dto)
        },
        true,
        'PATCH'
      )
    },
    onSuccess: () => {
      toast.success(t('updateSuccess'))
      queryClient.invalidateQueries({ queryKey: queryKeys.transfers.all() })
    },
    onError: (error) => {
      toast.error(
        t('updateError', { message: error.message || t('unexpectedError') })
      )
    }
  })
}

export function useUpdateTransferStatus(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.transfers')

  return useMutation({
    mutationFn: async ({
      id,
      dto
    }: {
      id: string
      dto: UpdateOwnershipTransferStatusDto
    }) => {
      return await apiFetch<UpdateTransferStatusResponse>(
        `${apiPaths.ownershipTransfers.status(id)}`,
        {
          body: JSON.stringify({ status: dto })
        },
        true,
        'PATCH'
      )
    },
    onSuccess: () => {
      toast.success(t('updateStatusSuccess'))
      queryClient.invalidateQueries({ queryKey: queryKeys.transfers.all() })
    },
    onError: (error) => {
      toast.error(
        t('updateStatusError', {
          message: error.message || t('unexpectedError')
        })
      )
    }
  })
}
