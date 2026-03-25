import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import { apiFetch } from '@/lib/api-client'
import { apiPaths } from '@/lib/api-paths'
import { GetAllProductModels, UpdateProductModel } from '@/lib/api-types'
import { queryKeys } from '@/lib/query-keys'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

type GetAllProductModelsResponse =
  GetAllProductModels['responses']['200']['content']['application/json']

export type UpdateModelDto =
  UpdateProductModel['requestBody']['content']['application/json']
type UpdateModelResponse =
  UpdateProductModel['responses']['200']['content']['application/json']

export function useGetModels() {
  return useQuery({
    queryKey: queryKeys.productModels.all(),
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
  const t = useTranslations('HookFeedback.productModels')

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
      toast.success(t('updateSuccess'))
      QueryClient.invalidateQueries({ queryKey: queryKeys.productModels.all() })
    },
    onError: () => {
      toast.error(t('updateError'))
    }
  })
}

export function useDeleteProductModel(QueryClient?: QueryClient) {
  const t = useTranslations('HookFeedback.productModels')
  const queryClient = useQueryClient()

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
      toast.success(t('deleteSuccess'))
      const activeQueryClient = QueryClient ?? queryClient
      activeQueryClient.invalidateQueries({
        queryKey: queryKeys.productModels.all()
      })
    },
    onError: () => {
      toast.error(t('deleteError'))
    }
  })
}
