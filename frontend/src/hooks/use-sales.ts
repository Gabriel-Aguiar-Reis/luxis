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
    queryKey: ['available-products-to-sell'],
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
  return useMutation({
    mutationFn: async (id: string) => {
      return await apiFetch(apiPaths.sales.confirm(id), {}, true, 'PATCH')
    },
    onSuccess: async () => {
      toast.success('Venda confirmada com sucesso!')
      await queryClient.invalidateQueries({
        queryKey: ['sales']
      })
    },
    onError: (error) => {
      toast.error(`Falha ao confirmar venda: ${error.message}`)
    }
  })
}

export function useGetSales() {
  return useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      return await apiFetch<GetAllSalesResponse>(apiPaths.sales.base, {}, true)
    },
    staleTime: 5 * 60 * 1000
  })
}

export function useGetSale(id: string) {
  return useQuery({
    queryKey: ['sale', id],
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
      toast.success('Venda criada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['sales'] })
    },
    onError: (error) => {
      toast.error(`Falha ao criar venda: ${error.message}`)
    }
  })
}

export function useDeleteSale(queryClient: QueryClient) {
  return useMutation({
    mutationFn: async (id: string) => {
      return await apiFetch(apiPaths.sales.byId(id), {}, true, 'DELETE')
    },
    onSuccess: () => {
      toast.success('Venda deletada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['sales'] })
    },
    onError: (error) => {
      toast.error(`Falha ao deletar venda: ${error.message}`)
    }
  })
}

export function useUpdateSale(queryClient: QueryClient) {
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
      toast.success('Venda atualizada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['sales'] })
    },
    onError: (error) => {
      toast.error(`Falha ao atualizar venda: ${error.message}`)
    }
  })
}

export function useUpdateMarkInstallmentPaid(queryClient: QueryClient) {
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
      toast.success('Parcela marcada como paga com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['sales'] })
    },
    onError: (error) => {
      toast.error(`Falha ao marcar parcela como paga: ${error.message}`)
    }
  })
}

export function useUpdateSaleStatus(queryClient: QueryClient) {
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
      toast.success('Status da venda atualizado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['sales'] })
    },
    onError: (error) => {
      toast.error(`Falha ao atualizar status da venda: ${error.message}`)
    }
  })
}
