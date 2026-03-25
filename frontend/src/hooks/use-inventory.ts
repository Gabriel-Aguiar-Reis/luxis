import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api-client'
import { GetInventoryByIdReturn } from '@/lib/api-types'
import { apiPaths } from '@/lib/api-paths'
import { queryKeys } from '@/lib/query-keys'

export function useGetInventoryById(resellerId: string) {
  return useQuery({
    queryKey: queryKeys.inventory.detail(resellerId),
    queryFn: async () => {
      return await apiFetch<GetInventoryByIdReturn>(
        apiPaths.inventory.byId(resellerId),
        {},
        true
      )
    },
    enabled: !!resellerId,
    staleTime: 5 * 60 * 1000
  })
}
