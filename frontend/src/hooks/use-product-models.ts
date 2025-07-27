import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api-client'
import { apiPaths } from '@/lib/api-paths'
import { GetAllProductModels } from '@/lib/api-types'

type GetAllProductModelsResponse =
  GetAllProductModels['responses']['200']['content']['application/json']

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
