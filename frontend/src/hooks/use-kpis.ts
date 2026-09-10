import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { unwrapResponse } from '@/lib/unwrap-response'
import type {
  ParamsWithMandatoryPeriodDto,
  ParamsDto,
  GetTotalBillingByResellerIdParams,
  ProductInStockDto,
  ProductWithResellerDto,
  SalesInPeriodDto,
  SalesAggregatedByDayDto,
  SalesByResellerDto,
  TotalSalesByResellerDto,
  TotalSalesInPeriodDto,
  TotalBillingReturnDto,
  ReturnsInPeriodDto,
  TotalReturnsInPeriodDto,
  GetOwnershipTransfersByResellerId200,
  GetOwnershipTransfersInPeriod200,
  GetOwnershipTransfersReceivedByResellerId200,
  GetOwnershipTransfersGivenByResellerId200,
  GetReturnsByResellerId200,
  GetTotalReturnsByResellerId200,
  GetReturnsByReseller200,
  GetTotalReturnsByReseller200,
  MonthlySalesDto,
  InventoryProductModelDto,
  SellingProductDto,
  ProductInInventoryDto
} from '@/api/model'

import {
  useGetTotalProductsInStock as useGetTotalProductsInStockRaw,
  useGetProductsInStock as useGetProductsInStockRaw,
  useGetProductsWithResellers as useGetProductsWithResellersRaw,
  useGetTotalProductsWithResellers as useGetTotalProductsWithResellersRaw,
  useGetProductsInStockForMoreThanXDays as useGetProductsInStockForMoreThanXDaysRaw,
  useGetTotalProductsInStockForMoreThanXDays as useGetTotalProductsInStockForMoreThanXDaysRaw
} from '@/api/admins-kpis-products/admins-kpis-products'

import {
  useGetSalesByResellerId as useGetSalesByResellerIdRaw,
  useGetTotalSalesByResellerId as useGetTotalSalesByResellerIdRaw,
  useGetSalesInPeriod as useGetSalesInPeriodRaw,
  useGetTotalSalesInPeriod as useGetTotalSalesInPeriodRaw,
  useGetSalesAggregatedByDay as useGetSalesAggregatedByDayRaw,
  useGetSalesByReseller as useGetSalesByResellerRaw,
  useGetTotalSalesByReseller as useGetTotalSalesByResellerRaw,
  useGetTotalBillingByBatchId as useGetTotalBillingByBatchIdRaw,
  useGetTotalBillingByResellerId as useGetTotalBillingByResellerIdRaw,
  useGetTotalBillingByPeriod as useGetTotalBillingByPeriodRaw
} from '@/api/admins-kpis-sales/admins-kpis-sales'

import {
  useGetOwnershipTransfersByResellerId as useGetOwnershipTransfersByResellerIdRaw,
  useGetTotalOwnershipTransfersByResellerId as useGetTotalOwnershipTransfersByResellerIdRaw,
  useGetOwnershipTransfersInPeriod as useGetOwnershipTransfersInPeriodRaw,
  useGetTotalOwnershipTransfersInPeriod as useGetTotalOwnershipTransfersInPeriodRaw,
  useGetOwnershipTransfersReceivedByResellerId as useGetOwnershipTransfersReceivedByResellerIdRaw,
  useGetTotalOwnershipTransfersReceivedByResellerId as useGetTotalOwnershipTransfersReceivedByResellerIdRaw,
  useGetOwnershipTransfersGivenByResellerId as useGetOwnershipTransfersGivenByResellerIdRaw,
  useGetTotalOwnershipTransfersGivenByResellerId as useGetTotalOwnershipTransfersGivenByResellerIdRaw
} from '@/api/admins-kpis-ownership-transfers/admins-kpis-ownership-transfers'

import {
  useGetReturnsByResellerId as useGetReturnsByResellerIdRaw,
  useGetTotalReturnsByResellerId as useGetTotalReturnsByResellerIdRaw,
  useGetReturnsByReseller as useGetReturnsByResellerRaw,
  useGetTotalReturnsByReseller as useGetTotalReturnsByResellerRaw,
  useGetReturnsInPeriod as useGetReturnsInPeriodRaw,
  useGetTotalReturnsInPeriod as useGetTotalReturnsInPeriodRaw
} from '@/api/admins-kpis-returns/admins-kpis-returns'

import { resellerSaleKpiGetMonthlySales } from '@/api/reseller-kpis-sales/reseller-kpis-sales'
import { resellerSaleKpiGetAverageTicket } from '@/api/reseller-kpis-sales/reseller-kpis-sales'
import { resellerInventoryKpiGetCurrentInventory } from '@/api/reseller-kpis-inventory/reseller-kpis-inventory'
import {
  resellerProductKpiGetTopSellingProducts,
  resellerProductKpiGetProductsWithLongestTimeInInventory
} from '@/api/reseller-kpis-products/reseller-kpis-products'
import { resellerReturnKpiGetReturnsMadeByReseller } from '@/api/reseller-kpis-returns/reseller-kpis-returns'

type PeriodQuery = { start: string; end: string; limit?: number; page?: number }
type OptionalPeriodQuery =
  | { start?: string; end?: string; limit?: number; page?: number }
  | undefined

// --- Produtos ---
export function useTotalInStockProducts() {
  const result = useGetTotalProductsInStockRaw({} as ParamsDto, undefined, {
    query: { queryKey: queryKeys.kpis.admin.totalInStockProducts() }
  })
  return { ...result, data: unwrapResponse<number>(result.data) }
}

export function useProductsInStock() {
  const result = useGetProductsInStockRaw({} as ParamsDto, undefined, {
    query: { queryKey: queryKeys.kpis.admin.productsInStock() }
  })
  return { ...result, data: unwrapResponse<ProductInStockDto[]>(result.data) }
}

export function useProductsWithResellers() {
  const result = useGetProductsWithResellersRaw({} as ParamsDto, undefined, {
    query: { queryKey: queryKeys.kpis.admin.productsWithResellers() }
  })
  return {
    ...result,
    data: unwrapResponse<ProductWithResellerDto[]>(result.data)
  }
}

export function useTotalProductsWithResellers() {
  const result = useGetTotalProductsWithResellersRaw(
    {} as ParamsDto,
    undefined,
    {
      query: { queryKey: queryKeys.kpis.admin.totalProductsWithResellers() }
    }
  )
  return { ...result, data: unwrapResponse<number>(result.data) }
}

export function useProductsInStockForMoreThanXDays(days: number) {
  const result = useGetProductsInStockForMoreThanXDaysRaw(
    days,
    {} as ParamsDto,
    undefined,
    {
      query: {
        queryKey: queryKeys.kpis.admin.productsInStockForMoreThan(days),
        enabled: !!days
      }
    }
  )
  return {
    ...result,
    data: unwrapResponse<ProductInStockDto[]>(result.data)
  }
}

export function useTotalProductsInStockForMoreThanXDays(days: number) {
  const result = useGetTotalProductsInStockForMoreThanXDaysRaw(
    days,
    {} as ParamsDto,
    undefined,
    {
      query: {
        queryKey: queryKeys.kpis.admin.totalProductsInStockForMoreThan(days),
        enabled: !!days
      }
    }
  )
  return { ...result, data: unwrapResponse<number>(result.data) }
}

// --- Vendas ---
export function useSalesByResellerId(id: string) {
  const result = useGetSalesByResellerIdRaw(id, {} as ParamsDto, undefined, {
    query: { queryKey: queryKeys.kpis.admin.salesByReseller(id), enabled: !!id }
  })
  return { ...result, data: unwrapResponse<SalesByResellerDto[]>(result.data) }
}

export function useTotalSalesByResellerId(id: string) {
  const result = useGetTotalSalesByResellerIdRaw(
    id,
    {} as ParamsDto,
    undefined,
    {
      query: {
        queryKey: queryKeys.kpis.admin.totalSalesByReseller(id),
        enabled: !!id
      }
    }
  )
  return {
    ...result,
    data: unwrapResponse<TotalSalesByResellerDto>(result.data)
  }
}

export function useSalesInPeriod(query: PeriodQuery) {
  const result = useGetSalesInPeriodRaw(
    query as ParamsWithMandatoryPeriodDto,
    query,
    {
      query: {
        queryKey: queryKeys.kpis.admin.salesInPeriod(query),
        enabled: !!query?.start && !!query?.end
      }
    }
  )
  return {
    ...result,
    data: unwrapResponse<SalesInPeriodDto>(result.data)
  }
}

export function useTotalSalesInPeriod(query: PeriodQuery) {
  const result = useGetTotalSalesInPeriodRaw(
    query as ParamsWithMandatoryPeriodDto,
    query,
    {
      query: {
        queryKey: queryKeys.kpis.admin.totalSalesInPeriod(query),
        enabled: !!query?.start && !!query?.end
      }
    }
  )
  return { ...result, data: unwrapResponse<TotalSalesInPeriodDto>(result.data) }
}

export function useSalesAggregatedByDay(query: PeriodQuery) {
  const result = useGetSalesAggregatedByDayRaw(
    query as ParamsWithMandatoryPeriodDto,
    query,
    {
      query: {
        queryKey: queryKeys.kpis.admin.salesAggregatedByDay(query),
        enabled: !!query?.start && !!query?.end
      }
    }
  )
  return {
    ...result,
    data: unwrapResponse<SalesAggregatedByDayDto>(result.data)
  }
}

export function useSalesByReseller(query?: OptionalPeriodQuery) {
  const result = useGetSalesByResellerRaw({} as ParamsDto, undefined, {
    query: { queryKey: queryKeys.kpis.admin.salesByResellerList(query) }
  })
  return { ...result, data: unwrapResponse<SalesByResellerDto[]>(result.data) }
}

export function useTotalSalesByReseller(query?: OptionalPeriodQuery) {
  const result = useGetTotalSalesByResellerRaw({} as ParamsDto, undefined, {
    query: { queryKey: queryKeys.kpis.admin.totalSalesByResellerList(query) }
  })
  return {
    ...result,
    data: unwrapResponse<TotalSalesByResellerDto>(result.data)
  }
}

export function useTotalBillingByBatchId(id: string) {
  const result = useGetTotalBillingByBatchIdRaw(id, {
    query: {
      queryKey: queryKeys.kpis.admin.totalBillingByBatch(id),
      enabled: !!id
    }
  })
  return { ...result, data: unwrapResponse<TotalBillingReturnDto>(result.data) }
}

export function useTotalBillingByResellerId(resellerId: string) {
  const result = useGetTotalBillingByResellerIdRaw(
    resellerId,
    {} as ParamsWithMandatoryPeriodDto,
    {} as GetTotalBillingByResellerIdParams,
    {
      query: {
        queryKey: queryKeys.kpis.admin.totalBillingByReseller(resellerId),
        enabled: !!resellerId
      }
    }
  )
  return { ...result, data: unwrapResponse<TotalBillingReturnDto>(result.data) }
}

export function useTotalBillingByPeriod(query: PeriodQuery) {
  const result = useGetTotalBillingByPeriodRaw(
    query as ParamsWithMandatoryPeriodDto,
    query,
    {
      query: {
        queryKey: queryKeys.kpis.admin.totalBillingByPeriod(query),
        enabled: !!query?.start && !!query?.end
      }
    }
  )
  return { ...result, data: unwrapResponse<TotalBillingReturnDto>(result.data) }
}

// --- Ownership Transfers ---
export function useOwnershipTransfersByResellerId(id: string) {
  const result = useGetOwnershipTransfersByResellerIdRaw(
    id,
    {} as ParamsDto,
    undefined,
    {
      query: {
        queryKey: queryKeys.kpis.admin.ownershipTransfersByReseller(id),
        enabled: !!id
      }
    }
  )
  return {
    ...result,
    data: unwrapResponse<GetOwnershipTransfersByResellerId200>(result.data)
  }
}

export function useTotalOwnershipTransfersByResellerId(id: string) {
  const result = useGetTotalOwnershipTransfersByResellerIdRaw(
    id,
    {} as ParamsDto,
    undefined,
    {
      query: {
        queryKey: queryKeys.kpis.admin.totalOwnershipTransfersByReseller(id),
        enabled: !!id
      }
    }
  )
  return { ...result, data: unwrapResponse<number>(result.data) }
}

export function useOwnershipTransfersInPeriod(query: PeriodQuery) {
  const result = useGetOwnershipTransfersInPeriodRaw(
    query as ParamsWithMandatoryPeriodDto,
    query,
    {
      query: {
        queryKey: queryKeys.kpis.admin.ownershipTransfersInPeriod(query),
        enabled: !!query?.start && !!query?.end
      }
    }
  )
  return {
    ...result,
    data: unwrapResponse<GetOwnershipTransfersInPeriod200>(result.data)
  }
}

export function useTotalOwnershipTransfersInPeriod(query: PeriodQuery) {
  const result = useGetTotalOwnershipTransfersInPeriodRaw(
    query as ParamsWithMandatoryPeriodDto,
    query,
    {
      query: {
        queryKey: queryKeys.kpis.admin.totalOwnershipTransfersInPeriod(query),
        enabled: !!query?.start && !!query?.end
      }
    }
  )
  return { ...result, data: unwrapResponse<number>(result.data) }
}

export function useOwnershipTransfersReceivedByResellerId(id: string) {
  const result = useGetOwnershipTransfersReceivedByResellerIdRaw(
    id,
    {} as ParamsDto,
    undefined,
    {
      query: {
        queryKey: queryKeys.kpis.admin.ownershipTransfersReceivedByReseller(id),
        enabled: !!id
      }
    }
  )
  return {
    ...result,
    data: unwrapResponse<GetOwnershipTransfersReceivedByResellerId200>(
      result.data
    )
  }
}

export function useTotalOwnershipTransfersReceivedByResellerId(id: string) {
  const result = useGetTotalOwnershipTransfersReceivedByResellerIdRaw(
    id,
    {} as ParamsDto,
    undefined,
    {
      query: {
        queryKey:
          queryKeys.kpis.admin.totalOwnershipTransfersReceivedByReseller(id),
        enabled: !!id
      }
    }
  )
  return { ...result, data: unwrapResponse<number>(result.data) }
}

export function useOwnershipTransfersGivenByResellerId(id: string) {
  const result = useGetOwnershipTransfersGivenByResellerIdRaw(
    id,
    {} as ParamsDto,
    undefined,
    {
      query: {
        queryKey: queryKeys.kpis.admin.ownershipTransfersGivenByReseller(id),
        enabled: !!id
      }
    }
  )
  return {
    ...result,
    data: unwrapResponse<GetOwnershipTransfersGivenByResellerId200>(result.data)
  }
}

export function useTotalOwnershipTransfersGivenByResellerId(id: string) {
  const result = useGetTotalOwnershipTransfersGivenByResellerIdRaw(
    id,
    {} as ParamsDto,
    undefined,
    {
      query: {
        queryKey:
          queryKeys.kpis.admin.totalOwnershipTransfersGivenByReseller(id),
        enabled: !!id
      }
    }
  )
  return { ...result, data: unwrapResponse<number>(result.data) }
}

// --- Returns ---
export function useReturnsByResellerId(id: string) {
  const result = useGetReturnsByResellerIdRaw(id, {} as ParamsDto, undefined, {
    query: {
      queryKey: queryKeys.kpis.admin.returnsByReseller(id),
      enabled: !!id
    }
  })
  return {
    ...result,
    data: unwrapResponse<GetReturnsByResellerId200>(result.data)
  }
}

export function useTotalReturnsByResellerId(id: string) {
  const result = useGetTotalReturnsByResellerIdRaw(
    id,
    {} as ParamsDto,
    undefined,
    {
      query: {
        queryKey: queryKeys.kpis.admin.totalReturnsByReseller(id),
        enabled: !!id
      }
    }
  )
  return {
    ...result,
    data: unwrapResponse<GetTotalReturnsByResellerId200>(result.data)
  }
}

export function useReturnsByReseller(query?: OptionalPeriodQuery) {
  const result = useGetReturnsByResellerRaw({} as ParamsDto, undefined, {
    query: {
      queryKey: queryKeys.kpis.admin.returnsByResellerList(query),
      enabled: !!query
    }
  })
  return {
    ...result,
    data: unwrapResponse<GetReturnsByReseller200>(result.data)
  }
}

export function useTotalReturnsByReseller(query?: OptionalPeriodQuery) {
  const result = useGetTotalReturnsByResellerRaw({} as ParamsDto, undefined, {
    query: {
      queryKey: queryKeys.kpis.admin.totalReturnsByResellerList(query),
      enabled: !!query
    }
  })
  return {
    ...result,
    data: unwrapResponse<GetTotalReturnsByReseller200>(result.data)
  }
}

export function useReturnsInPeriod(query: PeriodQuery) {
  const result = useGetReturnsInPeriodRaw(
    query as ParamsWithMandatoryPeriodDto,
    query,
    {
      query: {
        queryKey: queryKeys.kpis.admin.returnsInPeriod(query),
        enabled: !!query?.start && !!query?.end
      }
    }
  )
  return {
    ...result,
    data: unwrapResponse<ReturnsInPeriodDto>(result.data)
  }
}

export function useTotalReturnsInPeriod(query: PeriodQuery) {
  const result = useGetTotalReturnsInPeriodRaw(
    query as ParamsWithMandatoryPeriodDto,
    query,
    {
      query: {
        queryKey: queryKeys.kpis.admin.totalReturnsInPeriod(query),
        enabled: !!query?.start && !!query?.end
      }
    }
  )
  return {
    ...result,
    data: unwrapResponse<TotalReturnsInPeriodDto>(result.data)
  }
}

// --- Reseller KPIs ---
export function useMonthlySales(params?: ParamsDto) {
  return useQuery<MonthlySalesDto[]>({
    queryKey: queryKeys.kpis.mySpace.monthlySales(params),
    queryFn: async () => {
      const result = await resellerSaleKpiGetMonthlySales(params ?? {})
      return unwrapResponse<MonthlySalesDto[]>(result) ?? []
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })
}

export function useAverageTicket(params?: ParamsDto) {
  return useQuery<number>({
    queryKey: queryKeys.kpis.mySpace.averageTicket(params),
    queryFn: async () => {
      const result = await resellerSaleKpiGetAverageTicket(params ?? {})
      return unwrapResponse<number>(result) ?? 0
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })
}

export function useCurrentInventory(params?: ParamsDto) {
  return useQuery<InventoryProductModelDto[]>({
    queryKey: queryKeys.kpis.mySpace.currentInventory(params),
    queryFn: async () => {
      const result = await resellerInventoryKpiGetCurrentInventory(params ?? {})
      return unwrapResponse<InventoryProductModelDto[]>(result) ?? []
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })
}

export function useTopSellingProducts(params?: ParamsDto) {
  return useQuery<SellingProductDto[]>({
    queryKey: queryKeys.kpis.mySpace.topSellingProducts(params),
    queryFn: async () => {
      const result = await resellerProductKpiGetTopSellingProducts(params ?? {})
      return unwrapResponse<SellingProductDto[]>(result) ?? []
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })
}

export function useLongestTimeInInventory(params?: ParamsDto) {
  return useQuery<ProductInInventoryDto[]>({
    queryKey: queryKeys.kpis.mySpace.longestTimeInInventory(params),
    queryFn: async () => {
      const result =
        await resellerProductKpiGetProductsWithLongestTimeInInventory(
          params ?? {}
        )
      return unwrapResponse<ProductInInventoryDto[]>(result) ?? []
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })
}

export function useReturnCount(params?: ParamsDto) {
  return useQuery<number>({
    queryKey: queryKeys.kpis.mySpace.returnCount(params),
    queryFn: async () => {
      const result = await resellerReturnKpiGetReturnsMadeByReseller(
        params ?? {}
      )
      return unwrapResponse<number>(result) ?? 0
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })
}
