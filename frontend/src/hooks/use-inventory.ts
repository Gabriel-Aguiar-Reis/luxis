import { useGetInventoryById as useGetInventoryByIdRaw } from '@/api/inventory/inventory'
import type { GetInventoryByIdReturnDto } from '@/api/model'
import { queryKeys } from '@/lib/query-keys'
import { unwrapResponse } from '@/lib/unwrap-response'

export type GetInventoryByIdReturn = GetInventoryByIdReturnDto

export function useGetInventoryById(resellerId: string) {
  const result = useGetInventoryByIdRaw(resellerId, {
    query: {
      queryKey: queryKeys.inventory.detail(resellerId),
      enabled: !!resellerId,
      staleTime: 5 * 60 * 1000
    }
  })
  return {
    ...result,
    data: unwrapResponse<GetInventoryByIdReturnDto>(result.data)
  }
}
