import {
  useGetAllCustomers as useGetAllCustomersRaw,
  useCreateCustomer as useCreateCustomerRaw,
  useUpdateCustomer as useUpdateCustomerRaw
} from '@/api/customers/customers'
import type {
  Customer,
  CreateCustomerDto as OrvalCreateCustomerDto,
  UpdateCustomerDto as OrvalUpdateCustomerDto
} from '@/api/model'
import { queryKeys } from '@/lib/query-keys'
import { QueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export type GetAllCustomersResponse = Customer[]
export type GetOneCustomerResponse = Customer
export type CreateCustomerDto = OrvalCreateCustomerDto
export type UpdateCustomerDto = OrvalUpdateCustomerDto

export function useGetCustomers() {
  const result = useGetAllCustomersRaw({
    query: { queryKey: queryKeys.customers.all(), staleTime: 5 * 60 * 1000 }
  })
  return {
    ...result,
    data: (result.data as any)?.data as Customer[] | undefined
  }
}

export function useCreateCustomer(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.customers')

  const mutation = useCreateCustomerRaw({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.customers.all() })
        toast.success(t('createSuccess'))
      },
      onError: () => {
        toast.error(t('createError'))
      }
    }
  })

  return {
    ...mutation,
    mutate: (
      data: CreateCustomerDto,
      options?: { onSuccess?: (data: any) => void }
    ) =>
      mutation.mutate({ data }, {
        onSuccess: options?.onSuccess
          ? (response: any) => options.onSuccess?.((response as any)?.data)
          : undefined
      } as any),
    mutateAsync: (data: CreateCustomerDto) => mutation.mutateAsync({ data })
  }
}

export function useUpdateCustomer(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.customers')

  const mutation = useUpdateCustomerRaw({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.customers.all() })
        toast.success(t('updateSuccess'))
      },
      onError: () => {
        toast.error(t('updateError'))
      }
    }
  })

  return {
    ...mutation,
    mutate: ({ id, dto }: { id: string; dto: UpdateCustomerDto }) =>
      mutation.mutate({ id, data: dto }),
    mutateAsync: ({ id, dto }: { id: string; dto: UpdateCustomerDto }) =>
      mutation.mutateAsync({ id, data: dto })
  }
}
