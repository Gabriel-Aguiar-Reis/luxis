import { apiFetch } from '@/lib/api-client'
import { apiPaths } from '@/lib/api-paths'
import { GetAllBatches, GetOneBatch, PostBatch } from '@/lib/api-types'
import { queryKeys } from '@/lib/query-keys'
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export type GetOneBatchResponse =
  GetOneBatch['responses']['200']['content']['application/json']
export type GetAllBatchesResponse =
  GetAllBatches['responses']['200']['content']['application/json']

export type CreateBatchDto =
  PostBatch['requestBody']['content']['application/json']

type CreateBatchResponse =
  PostBatch['responses']['201']['content']['application/json']

export function useGetBatches() {
  return useQuery({
    queryKey: queryKeys.batches.all(),
    queryFn: async () => {
      return await apiFetch<GetAllBatchesResponse>(
        apiPaths.batches.base,
        {},
        true
      )
    },
    staleTime: 5 * 60 * 1000
  })
}

export function useCreateBatch(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.batches')

  return useMutation({
    mutationFn: async (data: CreateBatchDto) => {
      return await apiFetch<CreateBatchResponse>(
        apiPaths.batches.base,
        {
          body: JSON.stringify(data)
        },
        true,
        'POST'
      )
    },
    onSuccess: () => {
      toast.success(t('createSuccess'))
      queryClient.invalidateQueries({ queryKey: queryKeys.batches.all() })
    },
    onError: (e) => {
      toast.error(e.message || t('createError'))
    }
  })
}

export function useDeleteBatch(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.batches')

  return useMutation({
    mutationFn: async (id: string) => {
      return await apiFetch<void>(apiPaths.batches.byId(id), {}, true, 'DELETE')
    },
    onSuccess: () => {
      toast.success(t('deleteSuccess'))
      queryClient.invalidateQueries({ queryKey: queryKeys.batches.all() })
    },
    onError: (e) => {
      toast.error(e.message || t('deleteError'))
    }
  })
}
