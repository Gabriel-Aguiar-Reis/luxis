import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api-client'
import { apiPaths } from '@/lib/api-paths'
import { GetAllCategories } from '@/lib/api-types'

type GetAllCategoriesResponse =
  GetAllCategories['responses']['200']['content']['application/json']

export function useGetCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      return await apiFetch<GetAllCategoriesResponse>(
        apiPaths.categories.base,
        {},
        true
      )
    },
    staleTime: 5 * 60 * 1000
  })
}
