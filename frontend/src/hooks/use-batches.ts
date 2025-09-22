import { apiFetch } from '@/lib/api-client'
import { apiPaths } from '@/lib/api-paths'
import { GetAllBatches, GetOneBatch, PostBatch } from '@/lib/api-types'
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query'
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
    queryKey: ['batches'],
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
      toast.success(`Lote criado com sucesso`)
      queryClient.invalidateQueries({ queryKey: ['batches'] })
    },
    onError: (e) => {
      toast.error(e.message || 'Erro ao criar lote')
    }
  })
}

export function useDeleteBatch(queryClient: QueryClient) {
  return useMutation({
    mutationFn: async (id: string) => {
      return await apiFetch<void>(apiPaths.batches.byId(id), {}, true, 'DELETE')
    },
    onSuccess: () => {
      toast.success(`Lote deletado com sucesso`)
      queryClient.invalidateQueries({ queryKey: ['batches'] })
    },
    onError: (e) => {
      toast.error(e.message || 'Erro ao deletar lote')
    }
  })
}
