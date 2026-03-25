import { apiFetch } from '@/lib/api-client'
import { apiPaths } from '@/lib/api-paths'
import {
  GetAllSales,
  GetAvailableProductsToSellDto,
  GetOneSale,
  MarkInstallmentPaid,
  PostSale,
  UpdateSale,
  UpdateSaleStatus
} from '@/lib/api-types'
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export type GetAllSalesResponse =
  GetAllSales['responses']['200']['content']['application/json']

export type GetOneSaleResponse =
  GetOneSale['responses']['200']['content']['application/json']

export type CreateSaleDto =
  PostSale['requestBody']['content']['application/json']

export type CreateSaleResponse =
  PostSale['responses']['201']['content']['application/json']

export type UpdateSaleDto =
  UpdateSale['requestBody']['content']['application/json']

export type UpdateSaleStatusDto =
  UpdateSaleStatus['requestBody']['content']['application/json']

export type MarkInstallmentPaidDto =
  MarkInstallmentPaid['requestBody']['content']['application/json']

export enum PaymentMethod {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
  CASH = 'CASH',
  PIX = 'PIX',
  EXCHANGE = 'EXCHANGE'
}

export function useGetAvailableProductsToSell() {
  return useQuery({
    queryKey: queryKeys.sales.availableProducts(),
    queryFn: async () => {
      return await apiFetch<GetAvailableProductsToSellDto>(
        apiPaths.sales.availableProducts,
        {},
        true
      )
    },
    staleTime: 5 * 60 * 1000
  })
}

export function useConfirmSale(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.sales')

  return useMutation({
    mutationFn: async (id: string) => {
      return await apiFetch(apiPaths.sales.confirm(id), {}, true, 'PATCH')
    },
    onSuccess: async () => {
      toast.success(t('confirmSuccess'))
      await queryClient.invalidateQueries({
        queryKey: queryKeys.sales.all()
      })
    },
    onError: (error) => {
      toast.error(
        t('confirmError', {
          message: error.message || t('unexpectedError')
        })
      )
    }
  })
}

export function useGetSales() {
  return useQuery({
    queryKey: queryKeys.sales.all(),
    queryFn: async () => {
      return await apiFetch<GetAllSalesResponse>(apiPaths.sales.base, {}, true)
    },
    staleTime: 5 * 60 * 1000
  })
}

export function useGetSale(id: string) {
  return useQuery({
    queryKey: queryKeys.sales.detail(id),
    queryFn: async () => {
      return await apiFetch<GetOneSaleResponse>(
        apiPaths.sales.byId(id),
        {},
        true
      )
    },
    enabled: !!id,
    staleTime: 0, // Permite refetch imediato após invalidação
    refetchOnWindowFocus: true // Refetch quando a janela recebe foco
  })
}

export function useCreateSale(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.sales')

  return useMutation({
    mutationFn: async (dto: CreateSaleDto) => {
      return await apiFetch<CreateSaleResponse>(
        apiPaths.sales.base,
        {
          body: JSON.stringify(dto)
        },
        true,
        'POST'
      )
    },
    onSuccess: () => {
      toast.success(t('createSuccess'))
      queryClient.invalidateQueries({ queryKey: queryKeys.sales.all() })
    },
    onError: (error) => {
      toast.error(
        t('createError', {
          message: error.message || t('unexpectedError')
        })
      )
    }
  })
}

export function useDeleteSale(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.sales')

  return useMutation({
    mutationFn: async (id: string) => {
      return await apiFetch(apiPaths.sales.byId(id), {}, true, 'DELETE')
    },
    onSuccess: () => {
      toast.success(t('deleteSuccess'))
      queryClient.invalidateQueries({ queryKey: queryKeys.sales.all() })
    },
    onError: (error) => {
      toast.error(
        t('deleteError', {
          message: error.message || t('unexpectedError')
        })
      )
    }
  })
}

export function useUpdateSale(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.sales')

  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateSaleDto }) => {
      return await apiFetch(
        apiPaths.sales.byId(id),
        {
          body: JSON.stringify(dto)
        },
        true,
        'PATCH'
      )
    },
    onSuccess: () => {
      toast.success(t('updateSuccess'))
      queryClient.invalidateQueries({ queryKey: queryKeys.sales.all() })
    },
    onError: (error) => {
      toast.error(
        t('updateError', {
          message: error.message || t('unexpectedError')
        })
      )
    }
  })
}

export function useUpdateMarkInstallmentPaid(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.sales')

  return useMutation({
    mutationFn: async ({
      id,
      dto
    }: {
      id: string
      dto: MarkInstallmentPaidDto
    }) => {
      return await apiFetch(
        apiPaths.sales.markInstallmentPaid(id),
        {
          body: JSON.stringify(dto)
        },
        true,
        'PATCH'
      )
    },
    onSuccess: () => {
      toast.success(t('markInstallmentPaidSuccess'))
      queryClient.invalidateQueries({ queryKey: queryKeys.sales.all() })
    },
    onError: (error) => {
      toast.error(
        t('markInstallmentPaidError', {
          message: error.message || t('unexpectedError')
        })
      )
    }
  })
}

export function useUpdateSaleStatus(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.sales')

  return useMutation({
    mutationFn: async ({
      id,
      dto
    }: {
      id: string
      dto: UpdateSaleStatusDto
    }) => {
      return await apiFetch(
        apiPaths.sales.status(id),
        { body: JSON.stringify(dto) },
        true,
        'PATCH'
      )
    },
    onSuccess: () => {
      toast.success(t('updateStatusSuccess'))
      queryClient.invalidateQueries({ queryKey: queryKeys.sales.all() })
    },
    onError: (error) => {
      toast.error(
        t('updateStatusError', {
          message: error.message || t('unexpectedError')
        })
      )
    }
  })
}
