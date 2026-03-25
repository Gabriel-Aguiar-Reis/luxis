import {
  useGetAllSales as useGetAllSalesRaw,
  useGetAvailableProductsToSell as useGetAvailableProductsToSellRaw,
  useGetOneSale as useGetOneSaleRaw,
  useCreateSale as useCreateSaleRaw,
  useDeleteSale as useDeleteSaleRaw,
  useUpdateSale as useUpdateSaleRaw,
  useMarkInstallmentPaid as useMarkInstallmentPaidRaw,
  useUpdateSaleStatus as useUpdateSaleStatusRaw,
  useConfirmSale as useConfirmSaleRaw
} from '@/api/sales/sales'
import type {
  GetSaleDto,
  GetAvailableProductsToSellDto,
  CreateSaleDto as OrvalCreateSaleDto,
  UpdateSaleDto as OrvalUpdateSaleDto,
  UpdateSaleStatusDto as OrvalUpdateSaleStatusDto,
  MarkInstallmentPaidDto as OrvalMarkInstallmentPaidDto
} from '@/api/model'
import { QueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export type GetAllSalesResponse = GetSaleDto[]
export type GetOneSaleResponse = GetSaleDto
export type CreateSaleDto = OrvalCreateSaleDto
export type UpdateSaleDto = OrvalUpdateSaleDto
export type UpdateSaleStatusDto = OrvalUpdateSaleStatusDto
export type MarkInstallmentPaidDto = OrvalMarkInstallmentPaidDto

export enum PaymentMethod {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
  CASH = 'CASH',
  PIX = 'PIX',
  EXCHANGE = 'EXCHANGE'
}

export function useGetAvailableProductsToSell() {
  const result = useGetAvailableProductsToSellRaw({
    query: {
      queryKey: queryKeys.sales.availableProducts(),
      staleTime: 5 * 60 * 1000
    }
  })
  return {
    ...result,
    data: (result.data as any)?.data as
      | GetAvailableProductsToSellDto
      | undefined
  }
}

export function useConfirmSale(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.sales')

  const mutation = useConfirmSaleRaw({
    mutation: {
      onSuccess: async () => {
        toast.success(t('confirmSuccess'))
        await queryClient.invalidateQueries({ queryKey: queryKeys.sales.all() })
      },
      onError: (e: Error) => {
        toast.error(
          t('confirmError', { message: e.message || t('unexpectedError') })
        )
      }
    }
  })

  return {
    ...mutation,
    mutate: (id: string) => mutation.mutate({ id }),
    mutateAsync: (id: string) => mutation.mutateAsync({ id })
  }
}

export function useGetSales() {
  const result = useGetAllSalesRaw({
    query: { queryKey: queryKeys.sales.all(), staleTime: 5 * 60 * 1000 }
  })
  return {
    ...result,
    data: (result.data as any)?.data as GetSaleDto[] | undefined
  }
}

export function useGetSale(id: string) {
  const result = useGetOneSaleRaw(id, {
    query: {
      queryKey: queryKeys.sales.detail(id),
      enabled: !!id,
      staleTime: 0,
      refetchOnWindowFocus: true
    }
  })
  return {
    ...result,
    data: (result.data as any)?.data as GetSaleDto | undefined
  }
}

export function useCreateSale(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.sales')

  const mutation = useCreateSaleRaw({
    mutation: {
      onSuccess: () => {
        toast.success(t('createSuccess'))
        queryClient.invalidateQueries({ queryKey: queryKeys.sales.all() })
      },
      onError: (e: Error) => {
        toast.error(
          t('createError', { message: e.message || t('unexpectedError') })
        )
      }
    }
  })

  return {
    ...mutation,
    mutate: (
      data: CreateSaleDto,
      options?: { onSuccess?: (data: any) => void }
    ) =>
      mutation.mutate({ data }, {
        onSuccess: options?.onSuccess
          ? (response: any) => options.onSuccess?.((response as any)?.data)
          : undefined
      } as any),
    mutateAsync: (data: CreateSaleDto) => mutation.mutateAsync({ data })
  }
}

export function useDeleteSale(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.sales')

  const mutation = useDeleteSaleRaw({
    mutation: {
      onSuccess: () => {
        toast.success(t('deleteSuccess'))
        queryClient.invalidateQueries({ queryKey: queryKeys.sales.all() })
      },
      onError: (e: Error) => {
        toast.error(
          t('deleteError', { message: e.message || t('unexpectedError') })
        )
      }
    }
  })

  return {
    ...mutation,
    mutate: (id: string) => mutation.mutate({ id }),
    mutateAsync: (id: string) => mutation.mutateAsync({ id })
  }
}

export function useUpdateSale(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.sales')

  const mutation = useUpdateSaleRaw({
    mutation: {
      onSuccess: () => {
        toast.success(t('updateSuccess'))
        queryClient.invalidateQueries({ queryKey: queryKeys.sales.all() })
      },
      onError: (e: Error) => {
        toast.error(
          t('updateError', { message: e.message || t('unexpectedError') })
        )
      }
    }
  })

  return {
    ...mutation,
    mutate: ({ id, dto }: { id: string; dto: UpdateSaleDto }) =>
      mutation.mutate({ id, data: dto }),
    mutateAsync: ({ id, dto }: { id: string; dto: UpdateSaleDto }) =>
      mutation.mutateAsync({ id, data: dto })
  }
}

export function useUpdateMarkInstallmentPaid(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.sales')

  const mutation = useMarkInstallmentPaidRaw({
    mutation: {
      onSuccess: () => {
        toast.success(t('markInstallmentPaidSuccess'))
        queryClient.invalidateQueries({ queryKey: queryKeys.sales.all() })
      },
      onError: (e: Error) => {
        toast.error(
          t('markInstallmentPaidError', {
            message: e.message || t('unexpectedError')
          })
        )
      }
    }
  })

  return {
    ...mutation,
    mutate: ({ id, dto }: { id: string; dto: MarkInstallmentPaidDto }) =>
      mutation.mutate({ id, data: dto }),
    mutateAsync: ({ id, dto }: { id: string; dto: MarkInstallmentPaidDto }) =>
      mutation.mutateAsync({ id, data: dto })
  }
}

export function useUpdateSaleStatus(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.sales')

  const mutation = useUpdateSaleStatusRaw({
    mutation: {
      onSuccess: () => {
        toast.success(t('updateStatusSuccess'))
        queryClient.invalidateQueries({ queryKey: queryKeys.sales.all() })
      },
      onError: (e: Error) => {
        toast.error(
          t('updateStatusError', { message: e.message || t('unexpectedError') })
        )
      }
    }
  })

  return {
    ...mutation,
    mutate: ({ id, dto }: { id: string; dto: UpdateSaleStatusDto }) =>
      mutation.mutate({ id, data: dto }),
    mutateAsync: ({ id, dto }: { id: string; dto: UpdateSaleStatusDto }) =>
      mutation.mutateAsync({ id, data: dto })
  }
}
