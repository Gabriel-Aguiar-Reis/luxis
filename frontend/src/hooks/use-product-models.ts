import { useMutation, useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api-client'
import { apiPaths } from '@/lib/api-paths'
import { GetAllProductModels, UpdateProductModel } from '@/lib/api-types'

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

export function useChangeProductModel() {
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
    }
  })
}

export function useDeleteProductModel() {
  return useMutation({
    mutationFn: async (id: string) => {
      return await apiFetch<void>(
        apiPaths.productModels.byId(id),
        {},
        true,
        'DELETE'
      )
    }
  })
}
