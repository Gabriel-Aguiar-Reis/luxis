import {
  useGetAllProducts as useGetAllProductsRaw,
  useGetAvailableProducts as useGetAvailableProductsRaw,
  useUpdateProduct as useUpdateProductRaw
} from '@/api/products/products'
import type {
  Product,
  UpdateProductDto as OrvalUpdateProductDto
} from '@/api/model'
import { queryKeys } from '@/lib/query-keys'
import { unwrapResponse } from '@/lib/unwrap-response'
import { QueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export type UpdateProductDto = OrvalUpdateProductDto
export type UpdateProductResponse = Product

export function useGetProducts() {
  const result = useGetAllProductsRaw({
    query: { queryKey: queryKeys.products.all(), staleTime: 5 * 60 * 1000 }
  })
  return {
    ...result,
    data: unwrapResponse<Product[]>(result.data)
  }
}

export function useGetAvailableProducts() {
  const result = useGetAvailableProductsRaw({
    query: {
      queryKey: queryKeys.products.available(),
      staleTime: 1 * 60 * 1000
    }
  })
  return {
    ...result,
    data: unwrapResponse<Product[]>(result.data)
  }
}

export function useChangeProduct(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.products')

  const mutation = useUpdateProductRaw({
    mutation: {
      onSuccess: async () => {
        toast.success(t('updateSuccess'))
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: queryKeys.products.all()
          }),
          queryClient.invalidateQueries({
            queryKey: queryKeys.products.available()
          })
        ])
      },
      onError: () => {
        toast.error(t('updateError'))
      }
    }
  })

  return {
    ...mutation,
    mutate: ({ id, dto }: { id: string; dto: UpdateProductDto }) =>
      mutation.mutate({ id, data: dto }),
    mutateAsync: ({ id, dto }: { id: string; dto: UpdateProductDto }) =>
      mutation.mutateAsync({ id, data: dto })
  }
}
