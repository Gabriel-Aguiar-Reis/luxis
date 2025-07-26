import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api-client'
import { apiPaths } from '@/lib/api-paths'
import { GetReturnsByResellerId, ReturnStatus } from '@/lib/api-types'

export const ReturnStatusMap: Record<ReturnStatus, string> = {
  PENDING: 'Pendente',
  APPROVED: 'Aprovado',
  RETURNED: 'Devolvido',
  CANCELLED: 'Cancelado'
}

export type GetReturnsByResellerResponse =
  GetReturnsByResellerId['responses']['200']['content']['application/json']
export function useGetReturnsByResellerId(resellerId: string) {
  return useQuery({
    queryKey: ['returns', resellerId],
    queryFn: async () => {
      return await apiFetch<GetReturnsByResellerResponse>(
        apiPaths.returns.reseller(resellerId),
        {},
        true
      )
    },
    staleTime: 5 * 60 * 1000
  })
}
