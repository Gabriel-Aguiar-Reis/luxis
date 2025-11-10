import { apiFetch } from '@/lib/api-client'
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { apiPaths } from '@/lib/api-paths'
import { GetAllProducts, UpdateProduct } from '@/lib/api-types'
import { toast } from 'sonner'

type GetAllProductsResponse =
  GetAllProducts['responses']['200']['content']['application/json']
export type UpdateProductDto =
  UpdateProduct['requestBody']['content']['application/json']
export type UpdateProductResponse =
  UpdateProduct['responses']['200']['content']['application/json']

export function useGetProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      return await apiFetch<GetAllProductsResponse>(
        apiPaths.products.base,
        {},
        true
      )
    },
    staleTime: 5 * 60 * 1000
  })
}

export function useGetAvailableProducts() {
  return useQuery({
    queryKey: ['products', 'available'],
    queryFn: async () => {
      return await apiFetch<GetAllProductsResponse>(
        apiPaths.products.available,
        {},
        true
      )
    },
    staleTime: 1 * 60 * 1000 // Cache menor para produtos disponíveis
  })
}

export function useChangeProduct(queryClient: QueryClient) {
  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateProductDto }) => {
      await apiFetch<UpdateProductResponse>(
        apiPaths.products.byId(id),
        {
          body: JSON.stringify(dto)
        },
        true,
        'PATCH'
      )
    },
    onSuccess: () => {
      toast.success(`Produto atualizado com sucesso`)
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: () => {
      toast.error('Erro ao atualizar produto')
    }
  })
}
