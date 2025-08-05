import { QueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api-client'
import { apiPaths } from '@/lib/api-paths'
import { GetAllProductModels, UpdateProductModel } from '@/lib/api-types'
import { toast } from 'sonner'

type GetAllProductModelsResponse =
  GetAllProductModels['responses']['200']['content']['application/json']

export type UpdateModelDto =
  UpdateProductModel['requestBody']['content']['application/json']
type UpdateModelResponse =
  UpdateProductModel['responses']['200']['content']['application/json']

export function useGetModels() {
  return useQuery({
    queryKey: ['product-models'],
    queryFn: async () => {
      return await apiFetch<GetAllProductModelsResponse>(
        apiPaths.productModels.base,
        {},
        true
      )
    },
    staleTime: 5 * 60 * 1000
  })
}

export function useChangeProductModel(QueryClient: QueryClient) {
  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateModelDto }) => {
      return await apiFetch<UpdateModelResponse>(
        apiPaths.productModels.byId(id),
        {
          body: JSON.stringify(dto)
        },
        true,
        'PATCH'
      )
    },
    onSuccess: () => {
      toast.success(`Modelo atualizado com sucesso`)
      QueryClient.invalidateQueries({ queryKey: ['product-models'] })
    },
    onError: () => {
      toast.error('Erro ao atualizar modelo')
    }
  })
}

export function useDeleteProductModel(QueryClient: QueryClient) {
  return useMutation({
    mutationFn: async (id: string) => {
      return await apiFetch<void>(
        apiPaths.productModels.byId(id),
        {},
        true,
        'DELETE'
      )
    },
    onSuccess: () => {
      toast.success(`Modelo excluído com sucesso`)
      QueryClient.invalidateQueries({ queryKey: ['product-models'] })
    },
    onError: () => {
      toast.error('Erro ao excluir modelo')
    }
  })
}
