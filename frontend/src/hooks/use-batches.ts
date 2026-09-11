import {
  useGetAllBatches as useGetAllBatchesRaw,
  useCreateBatch as useCreateBatchRaw,
  useDeleteBatch as useDeleteBatchRaw
} from '@/api/batches/batches'
import type {
  GetBatchDto,
  CreateBatchDto as OrvalCreateBatchDto
} from '@/api/model'
import { queryKeys } from '@/lib/query-keys'
import { unwrapResponse } from '@/lib/unwrap-response'
import { QueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export type GetOneBatchResponse = GetBatchDto
export type GetAllBatchesResponse = GetBatchDto[]
export type CreateBatchDto = OrvalCreateBatchDto

export function useGetBatches() {
  const result = useGetAllBatchesRaw({
    query: { queryKey: queryKeys.batches.all(), staleTime: 5 * 60 * 1000 }
  })
  return {
    ...result,
    data: unwrapResponse<GetBatchDto[]>(result.data)
  }
}

export function useCreateBatch(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.batches')

  const mutation = useCreateBatchRaw({
    mutation: {
      onSuccess: async () => {
        toast.success(t('createSuccess'))
        await queryClient.invalidateQueries({
          queryKey: queryKeys.batches.all()
        })
      },
      onError: (e: Error) => {
        toast.error(e.message || t('createError'))
      }
    }
  })

  return {
    ...mutation,
    mutate: (data: CreateBatchDto) => mutation.mutate({ data }),
    mutateAsync: (data: CreateBatchDto) => mutation.mutateAsync({ data })
  }
}

export function useDeleteBatch(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.batches')

  const mutation = useDeleteBatchRaw({
    mutation: {
      onSuccess: async () => {
        toast.success(t('deleteSuccess'))
        await queryClient.invalidateQueries({
          queryKey: queryKeys.batches.all()
        })
      },
      onError: (e: Error) => {
        toast.error(e.message || t('deleteError'))
      }
    }
  })

  return {
    ...mutation,
    mutate: (id: string) => mutation.mutate({ id }),
    mutateAsync: (id: string) => mutation.mutateAsync({ id })
  }
}
