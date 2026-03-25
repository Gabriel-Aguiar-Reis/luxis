import { apiFetch } from '@/lib/api-client'
import { apiPaths } from '@/lib/api-paths'
import {
  GetAllCustomers,
  GetOneCustomer,
  PostCustomer,
  UpdateCustomer
} from '@/lib/api-types'
import { queryKeys } from '@/lib/query-keys'
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export type GetAllCustomersResponse =
  GetAllCustomers['responses']['200']['content']['application/json']

export type GetOneCustomerResponse =
  GetOneCustomer['responses']['200']['content']['application/json']

export type CreateCustomerDto =
  PostCustomer['requestBody']['content']['application/json']

export type UpdateCustomerDto =
  UpdateCustomer['requestBody']['content']['application/json']

export function useGetCustomers() {
  return useQuery<GetAllCustomersResponse>({
    queryKey: queryKeys.customers.all(),
    queryFn: async () => {
      return await apiFetch<GetAllCustomersResponse>(
        apiPaths.customers.base,
        {},
        true
      )
    },
    staleTime: 5 * 60 * 1000
  })
}

export function useCreateCustomer(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.customers')

  return useMutation({
    mutationFn: async (dto: CreateCustomerDto) => {
      return await apiFetch<GetAllCustomersResponse[0]>(
        apiPaths.customers.base,
        {
          body: JSON.stringify(dto)
        },
        true,
        'POST'
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all() })
      toast.success(t('createSuccess'))
    },
    onError: () => {
      toast.error(t('createError'))
    }
  })
}

export function useUpdateCustomer(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.customers')

  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateCustomerDto }) => {
      return await apiFetch<GetAllCustomersResponse[0]>(
        apiPaths.customers.byId(id),
        {
          body: JSON.stringify(dto)
        },
        true,
        'PATCH'
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all() })
      toast.success(t('updateSuccess'))
    },
    onError: () => {
      toast.error(t('updateError'))
    }
  })
}
