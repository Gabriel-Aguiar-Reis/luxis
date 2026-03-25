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
    data: (result.data as any)?.data as Product[] | undefined
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
    data: (result.data as any)?.data as Product[] | undefined
  }
}

export function useChangeProduct(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.products')

  const mutation = useUpdateProductRaw({
    mutation: {
      onSuccess: () => {
        toast.success(t('updateSuccess'))
        queryClient.invalidateQueries({ queryKey: queryKeys.products.all() })
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
