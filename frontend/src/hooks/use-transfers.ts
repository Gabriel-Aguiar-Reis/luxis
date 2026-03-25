import {
  useGetAllOwnershipTransfers as useGetAllOwnershipTransfersRaw,
  useCreateOwnershipTransfer as useCreateOwnershipTransferRaw,
  useDeleteOwnershipTransfer as useDeleteOwnershipTransferRaw,
  useUpdateOwnershipTransfer as useUpdateOwnershipTransferRaw,
  useUpdateOwnershipTransferStatus as useUpdateOwnershipTransferStatusRaw
} from '@/api/ownership-transfers/ownership-transfers'
import type {
  OwnershipTransferWithSerialDto,
  CreateOwnershipTransferDto as OrvalCreateTransferDto,
  UpdateOwnershipTransferDto as OrvalUpdateTransferDto,
  UpdateOwnershipTransferStatusDto as OrvalUpdateTransferStatusDto
} from '@/api/model'
import { queryKeys } from '@/lib/query-keys'
import { QueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export type CreateTransferDto = OrvalCreateTransferDto
export type UpdateTransferDto = OrvalUpdateTransferDto
export type UpdateTransferStatusDto = OrvalUpdateTransferStatusDto
export type UpdateOwnershipTransferStatusDto = OrvalUpdateTransferStatusDto

export function useGetTransfers() {
  const result = useGetAllOwnershipTransfersRaw({
    query: { queryKey: queryKeys.transfers.all(), staleTime: 5 * 60 * 1000 }
  })
  return {
    ...result,
    data: (result.data as any)?.data as
      | OwnershipTransferWithSerialDto[]
      | undefined
  }
}

export function useCreateTransfer(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.transfers')

  const mutation = useCreateOwnershipTransferRaw({
    mutation: {
      onSuccess: () => {
        toast.success(t('createSuccess'))
        queryClient.invalidateQueries({ queryKey: queryKeys.transfers.all() })
      },
      onError: (e: Error) => {
        toast.error(
          t('createError', { message: e.message || t('unexpectedError') })
        )
      }
    }
  })

  return {
    ...mutation,
    mutate: (data: CreateTransferDto) => mutation.mutate({ data }),
    mutateAsync: (data: CreateTransferDto) => mutation.mutateAsync({ data })
  }
}

export function useDeleteTransfer(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.transfers')

  const mutation = useDeleteOwnershipTransferRaw({
    mutation: {
      onSuccess: () => {
        toast.success(t('deleteSuccess'))
        queryClient.invalidateQueries({ queryKey: queryKeys.transfers.all() })
      },
      onError: (e: Error) => {
        toast.error(
          t('deleteError', { message: e.message || t('unexpectedError') })
        )
      }
    }
  })

  return {
    ...mutation,
    mutate: (transferId: string) => mutation.mutate({ id: transferId }),
    mutateAsync: (transferId: string) =>
      mutation.mutateAsync({ id: transferId })
  }
}

export function useUpdateTransfer(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.transfers')

  const mutation = useUpdateOwnershipTransferRaw({
    mutation: {
      onSuccess: () => {
        toast.success(t('updateSuccess'))
        queryClient.invalidateQueries({ queryKey: queryKeys.transfers.all() })
      },
      onError: (e: Error) => {
        toast.error(
          t('updateError', { message: e.message || t('unexpectedError') })
        )
      }
    }
  })

  return {
    ...mutation,
    mutate: ({ id, dto }: { id: string; dto: UpdateTransferDto }) =>
      mutation.mutate({ id, data: dto }),
    mutateAsync: ({ id, dto }: { id: string; dto: UpdateTransferDto }) =>
      mutation.mutateAsync({ id, data: dto })
  }
}

export function useUpdateTransferStatus(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.transfers')

  const mutation = useUpdateOwnershipTransferStatusRaw({
    mutation: {
      onSuccess: () => {
        toast.success(t('updateStatusSuccess'))
        queryClient.invalidateQueries({ queryKey: queryKeys.transfers.all() })
      },
      onError: (e: Error) => {
        toast.error(
          t('updateStatusError', { message: e.message || t('unexpectedError') })
        )
      }
    }
  })

  return {
    ...mutation,
    mutate: ({ id, dto }: { id: string; dto: UpdateTransferStatusDto }) =>
      mutation.mutate({ id, data: dto }),
    mutateAsync: ({ id, dto }: { id: string; dto: UpdateTransferStatusDto }) =>
      mutation.mutateAsync({ id, data: dto })
  }
}
