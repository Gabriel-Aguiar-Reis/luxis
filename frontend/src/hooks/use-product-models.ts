import {
  useGetAllProductModels as useGetAllProductModelsRaw,
  useUpdateProductModel as useUpdateProductModelRaw,
  useDeleteProductModel as useDeleteProductModelRaw
} from '@/api/product-models/product-models'
import type {
  ProductModel,
  UpdateProductModelDto as OrvalUpdateModelDto
} from '@/api/model'
import { queryKeys } from '@/lib/query-keys'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export type UpdateModelDto = OrvalUpdateModelDto

export function useGetModels() {
  const result = useGetAllProductModelsRaw({
    query: { queryKey: queryKeys.productModels.all(), staleTime: 5 * 60 * 1000 }
  })
  return {
    ...result,
    data: (result.data as any)?.data as ProductModel[] | undefined
  }
}

export function useChangeProductModel(qClient: QueryClient) {
  const t = useTranslations('HookFeedback.productModels')

  const mutation = useUpdateProductModelRaw({
    mutation: {
      onSuccess: () => {
        toast.success(t('updateSuccess'))
        qClient.invalidateQueries({ queryKey: queryKeys.productModels.all() })
      },
      onError: () => {
        toast.error(t('updateError'))
      }
    }
  })

  return {
    ...mutation,
    mutate: ({ id, dto }: { id: string; dto: UpdateModelDto }) =>
      mutation.mutate({ id, data: dto }),
    mutateAsync: ({ id, dto }: { id: string; dto: UpdateModelDto }) =>
      mutation.mutateAsync({ id, data: dto })
  }
}

export function useDeleteProductModel(qClient?: QueryClient) {
  const t = useTranslations('HookFeedback.productModels')
  const queryClient = useQueryClient()

  const mutation = useDeleteProductModelRaw({
    mutation: {
      onSuccess: () => {
        toast.success(t('deleteSuccess'))
        const active = qClient ?? queryClient
        active.invalidateQueries({ queryKey: queryKeys.productModels.all() })
      },
      onError: () => {
        toast.error(t('deleteError'))
      }
    }
  })

  return {
    ...mutation,
    mutate: (id: string) => mutation.mutate({ id }),
    mutateAsync: (id: string) => mutation.mutateAsync({ id })
  }
}
