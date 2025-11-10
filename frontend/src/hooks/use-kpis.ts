import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api-client'
import { apiPaths } from '@/lib/api-paths'
import {
  // Produtos
  GetTotalInStockProducts,
  GetProductsInStock,
  GetProductsWithResellers,
  GetTotalProductsWithResellers,
  GetProductsInStockForMoreThanXDays,
  GetTotalProductsInStockForMoreThanXDays,
  // Vendas
  GetSalesByResellerId,
  GetTotalSalesByResellerId,
  GetSalesInPeriod,
  GetTotalSalesInPeriod,
  GetSalesByReseller,
  GetTotalSalesByReseller,
  GetTotalBillingByBatchId,
  GetTotalBillingByResellerId,
  GetTotalBillingByPeriod,
  // Ownership Transfers
  GetOwnershipTransfersByResellerId,
  GetTotalOwnershipTransfersByResellerId,
  GetOwnershipTransfersInPeriod,
  GetTotalOwnershipTransfersInPeriod,
  GetOwnershipTransfersReceivedByResellerId,
  GetTotalOwnershipTransfersReceivedByResellerId,
  GetOwnershipTransfersGivenByResellerId,
  GetTotalOwnershipTransfersGivenByResellerId,
  // Returns
  GetReturnsByResellerIdKpi,
  GetTotalReturnsByResellerId,
  GetReturnsByReseller,
  GetTotalReturnsByReseller,
  GetReturnsInPeriod,
  GetTotalReturnsInPeriod
} from '@/lib/api-types'

// --- Produtos ---
export function useTotalInStockProducts() {
  return useQuery<
    GetTotalInStockProducts['responses']['200']['content']['application/json']
  >({
    queryKey: ['kpi-total-in-stock-products'],
    queryFn: () =>
      apiFetch<
        GetTotalInStockProducts['responses']['200']['content']['application/json']
      >(apiPaths.kpiAdmin.productsInStockTotal, {}, true)
  })
}

export function useProductsInStock() {
  return useQuery<
    GetProductsInStock['responses']['200']['content']['application/json']
  >({
    queryKey: ['kpi-products-in-stock'],
    queryFn: () =>
      apiFetch<
        GetProductsInStock['responses']['200']['content']['application/json']
      >(apiPaths.kpiAdmin.productsInStock, {}, true)
  })
}

export function useProductsWithResellers() {
  return useQuery<
    GetProductsWithResellers['responses']['200']['content']['application/json']
  >({
    queryKey: ['kpi-products-with-resellers'],
    queryFn: () =>
      apiFetch<
        GetProductsWithResellers['responses']['200']['content']['application/json']
      >(apiPaths.kpiAdmin.productsWithResellers, {}, true)
  })
}

export function useTotalProductsWithResellers() {
  return useQuery<
    GetTotalProductsWithResellers['responses']['200']['content']['application/json']
  >({
    queryKey: ['kpi-total-products-with-resellers'],
    queryFn: () =>
      apiFetch<
        GetTotalProductsWithResellers['responses']['200']['content']['application/json']
      >(apiPaths.kpiAdmin.productsWithResellersTotal, {}, true)
  })
}

export function useProductsInStockForMoreThanXDays(days: number) {
  return useQuery<
    GetProductsInStockForMoreThanXDays['responses']['200']['content']['application/json']
  >({
    queryKey: ['kpi-products-in-stock-for-more-than', days],
    queryFn: () =>
      apiFetch<
        GetProductsInStockForMoreThanXDays['responses']['200']['content']['application/json']
      >(apiPaths.kpiAdmin.productsInStockForMoreThan(days), {}, true),
    enabled: !!days
  })
}

export function useTotalProductsInStockForMoreThanXDays(days: number) {
  return useQuery<
    GetTotalProductsInStockForMoreThanXDays['responses']['200']['content']['application/json']
  >({
    queryKey: ['kpi-total-products-in-stock-for-more-than', days],
    queryFn: () =>
      apiFetch<
        GetTotalProductsInStockForMoreThanXDays['responses']['200']['content']['application/json']
      >(apiPaths.kpiAdmin.productsInStockForMoreThanTotal(days), {}, true),
    enabled: !!days
  })
}

// --- Vendas ---
export function useSalesByResellerId(id: string) {
  return useQuery<
    GetSalesByResellerId['responses']['200']['content']['application/json']
  >({
    queryKey: ['kpi-sales-by-reseller', id],
    queryFn: () =>
      apiFetch<
        GetSalesByResellerId['responses']['200']['content']['application/json']
      >(apiPaths.kpiAdmin.salesByResellerId(id), {}, true),
    enabled: !!id
  })
}

export function useTotalSalesByResellerId(id: string) {
  return useQuery<
    GetTotalSalesByResellerId['responses']['200']['content']['application/json']
  >({
    queryKey: ['kpi-total-sales-by-reseller', id],
    queryFn: () =>
      apiFetch<
        GetTotalSalesByResellerId['responses']['200']['content']['application/json']
      >(apiPaths.kpiAdmin.salesTotalByResellerId(id), {}, true),
    enabled: !!id
  })
}

export function useSalesInPeriod(
  query: GetSalesInPeriod['parameters']['query']
) {
  return useQuery<
    GetSalesInPeriod['responses']['200']['content']['application/json']
  >({
    queryKey: ['kpi-sales-in-period', query],
    queryFn: () =>
      apiFetch<
        GetSalesInPeriod['responses']['200']['content']['application/json']
      >(apiPaths.kpiAdmin.salesByPeriod(query), {}, true),
    enabled: !!query?.start && !!query?.end
  })
}

export function useTotalSalesInPeriod(
  query: GetTotalSalesInPeriod['parameters']['query']
) {
  return useQuery<
    GetTotalSalesInPeriod['responses']['200']['content']['application/json']
  >({
    queryKey: ['kpi-total-sales-in-period', query],
    queryFn: () =>
      apiFetch<
        GetTotalSalesInPeriod['responses']['200']['content']['application/json']
      >(apiPaths.kpiAdmin.salesByPeriodTotal(query), {}, true),
    enabled: !!query?.start && !!query?.end
  })
}

export function useSalesAggregatedByDay(query: { start: string; end: string }) {
  return useQuery<{
    start: Date
    end: Date
    data: Array<{
      date: string
      sales: number
      totalAmount: string
    }>
  }>({
    queryKey: ['kpi-sales-aggregated-by-day', query],
    queryFn: () =>
      apiFetch<{
        start: Date
        end: Date
        data: Array<{
          date: string
          sales: number
          totalAmount: string
        }>
      }>(apiPaths.kpiAdmin.salesAggregatedByDay(query), {}, true),
    enabled: !!query?.start && !!query?.end
  })
}

export function useSalesByReseller(
  query: GetSalesByReseller['parameters']['query']
) {
  return useQuery<
    GetSalesByReseller['responses']['200']['content']['application/json']
  >({
    queryKey: ['kpi-sales-by-reseller-list', query],
    queryFn: () =>
      apiFetch<
        GetSalesByReseller['responses']['200']['content']['application/json']
      >(apiPaths.kpiAdmin.salesByResellers, {}, true)
  })
}

export function useTotalSalesByReseller(
  query: GetTotalSalesByReseller['parameters']['query']
) {
  return useQuery<
    GetTotalSalesByReseller['responses']['200']['content']['application/json']
  >({
    queryKey: ['kpi-total-sales-by-reseller-list', query],
    queryFn: () =>
      apiFetch<
        GetTotalSalesByReseller['responses']['200']['content']['application/json']
      >(apiPaths.kpiAdmin.salesByResellersTotal, {}, true)
  })
}

export function useTotalBillingByBatchId(id: string) {
  return useQuery<
    GetTotalBillingByBatchId['responses']['200']['content']['application/json']
  >({
    queryKey: ['kpi-total-billing-by-batch', id],
    queryFn: () =>
      apiFetch<
        GetTotalBillingByBatchId['responses']['200']['content']['application/json']
      >(apiPaths.kpiAdmin.totalBillingByBatchId(id), {}, true),
    enabled: !!id
  })
}

export function useTotalBillingByResellerId(resellerId: string) {
  return useQuery<
    GetTotalBillingByResellerId['responses']['200']['content']['application/json']
  >({
    queryKey: ['kpi-total-billing-by-reseller', resellerId],
    queryFn: () =>
      apiFetch<
        GetTotalBillingByResellerId['responses']['200']['content']['application/json']
      >(apiPaths.kpiAdmin.totalBillingByResellerId(resellerId), {}, true),
    enabled: !!resellerId
  })
}

export function useTotalBillingByPeriod(
  query: GetTotalBillingByPeriod['parameters']['query']
) {
  return useQuery<
    GetTotalBillingByPeriod['responses']['200']['content']['application/json']
  >({
    queryKey: ['kpi-total-billing-by-period', query],
    queryFn: () =>
      apiFetch<
        GetTotalBillingByPeriod['responses']['200']['content']['application/json']
      >(apiPaths.kpiAdmin.totalBillingByPeriod(query), {}, true),
    enabled: !!query?.start && !!query?.end
  })
}

// --- Ownership Transfers ---
export function useOwnershipTransfersByResellerId(id: string) {
  return useQuery<
    GetOwnershipTransfersByResellerId['responses']['200']['content']['application/json']
  >({
    queryKey: ['kpi-ownership-transfers-by-reseller', id],
    queryFn: () =>
      apiFetch<
        GetOwnershipTransfersByResellerId['responses']['200']['content']['application/json']
      >(apiPaths.kpiAdmin.ownershipTransfersByResellerId(id), {}, true),
    enabled: !!id
  })
}

export function useTotalOwnershipTransfersByResellerId(id: string) {
  return useQuery<
    GetTotalOwnershipTransfersByResellerId['responses']['200']['content']['application/json']
  >({
    queryKey: ['kpi-total-ownership-transfers-by-reseller', id],
    queryFn: () =>
      apiFetch<
        GetTotalOwnershipTransfersByResellerId['responses']['200']['content']['application/json']
      >(apiPaths.kpiAdmin.totalOwnershipTransfersByResellerId(id), {}, true),
    enabled: !!id
  })
}

export function useOwnershipTransfersInPeriod(
  query: GetOwnershipTransfersInPeriod['parameters']['query']
) {
  return useQuery<
    GetOwnershipTransfersInPeriod['responses']['200']['content']['application/json']
  >({
    queryKey: ['kpi-ownership-transfers-in-period', query],
    queryFn: () =>
      apiFetch<
        GetOwnershipTransfersInPeriod['responses']['200']['content']['application/json']
      >(
        `/kpi/admin/ownership-transfers/in-period?start=${query.start}&end=${query.end}`,
        {},
        true
      ),
    enabled: !!query?.start && !!query?.end
  })
}

export function useTotalOwnershipTransfersInPeriod(
  query: GetTotalOwnershipTransfersInPeriod['parameters']['query']
) {
  return useQuery<
    GetTotalOwnershipTransfersInPeriod['responses']['200']['content']['application/json']
  >({
    queryKey: ['kpi-total-ownership-transfers-in-period', query],
    queryFn: () =>
      apiFetch<
        GetTotalOwnershipTransfersInPeriod['responses']['200']['content']['application/json']
      >(
        `/kpi/admin/ownership-transfers/in-period/total?start=${query.start}&end=${query.end}`,
        {},
        true
      ),
    enabled: !!query?.start && !!query?.end
  })
}

export function useOwnershipTransfersReceivedByResellerId(id: string) {
  return useQuery<
    GetOwnershipTransfersReceivedByResellerId['responses']['200']['content']['application/json']
  >({
    queryKey: ['kpi-ownership-transfers-received-by-reseller', id],
    queryFn: () =>
      apiFetch<
        GetOwnershipTransfersReceivedByResellerId['responses']['200']['content']['application/json']
      >(apiPaths.kpiAdmin.ownershipTransfersReceivedByResellerId(id), {}, true),
    enabled: !!id
  })
}

export function useTotalOwnershipTransfersReceivedByResellerId(id: string) {
  return useQuery<
    GetTotalOwnershipTransfersReceivedByResellerId['responses']['200']['content']['application/json']
  >({
    queryKey: ['kpi-total-ownership-transfers-received-by-reseller', id],
    queryFn: () =>
      apiFetch<
        GetTotalOwnershipTransfersReceivedByResellerId['responses']['200']['content']['application/json']
      >(
        apiPaths.kpiAdmin.totalOwnershipTransfersReceivedByResellerId(id),
        {},
        true
      ),
    enabled: !!id
  })
}

export function useOwnershipTransfersGivenByResellerId(id: string) {
  return useQuery<
    GetOwnershipTransfersGivenByResellerId['responses']['200']['content']['application/json']
  >({
    queryKey: ['kpi-ownership-transfers-given-by-reseller', id],
    queryFn: () =>
      apiFetch<
        GetOwnershipTransfersGivenByResellerId['responses']['200']['content']['application/json']
      >(apiPaths.kpiAdmin.ownershipTransfersGivenByResellerId(id), {}, true),
    enabled: !!id
  })
}

export function useTotalOwnershipTransfersGivenByResellerId(id: string) {
  return useQuery<
    GetTotalOwnershipTransfersGivenByResellerId['responses']['200']['content']['application/json']
  >({
    queryKey: ['kpi-total-ownership-transfers-given-by-reseller', id],
    queryFn: () =>
      apiFetch<
        GetTotalOwnershipTransfersGivenByResellerId['responses']['200']['content']['application/json']
      >(
        apiPaths.kpiAdmin.totalOwnershipTransfersGivenByResellerId(id),
        {},
        true
      ),
    enabled: !!id
  })
}

// --- Returns ---
export function useReturnsByResellerId(id: string) {
  return useQuery<
    GetReturnsByResellerIdKpi['responses']['200']['content']['application/json']
  >({
    queryKey: ['kpi-returns-by-reseller', id],
    queryFn: () =>
      apiFetch<
        GetReturnsByResellerIdKpi['responses']['200']['content']['application/json']
      >(apiPaths.kpiAdmin.returnsByResellerId(id), {}, true),
    enabled: !!id
  })
}

export function useTotalReturnsByResellerId(id: string) {
  return useQuery<
    GetTotalReturnsByResellerId['responses']['200']['content']['application/json']
  >({
    queryKey: ['kpi-total-returns-by-reseller', id],
    queryFn: () =>
      apiFetch<
        GetTotalReturnsByResellerId['responses']['200']['content']['application/json']
      >(apiPaths.kpiAdmin.totalReturnsByResellerId(id), {}, true),
    enabled: !!id
  })
}

export function useReturnsByReseller(
  query: GetReturnsByReseller['parameters']['query']
) {
  return useQuery<
    GetReturnsByReseller['responses']['200']['content']['application/json']
  >({
    queryKey: ['kpi-returns-by-reseller-list', query],
    queryFn: () =>
      apiFetch<
        GetReturnsByReseller['responses']['200']['content']['application/json']
      >(apiPaths.kpiAdmin.returnsByReseller, {}, true),
    enabled: !!query
  })
}

export function useTotalReturnsByReseller(
  query: GetTotalReturnsByReseller['parameters']['query']
) {
  return useQuery<
    GetTotalReturnsByReseller['responses']['200']['content']['application/json']
  >({
    queryKey: ['kpi-total-returns-by-reseller-list', query],
    queryFn: () =>
      apiFetch<
        GetTotalReturnsByReseller['responses']['200']['content']['application/json']
      >(apiPaths.kpiAdmin.totalReturnsByReseller, {}, true),
    enabled: !!query
  })
}

export function useReturnsInPeriod(
  query: GetReturnsInPeriod['parameters']['query']
) {
  return useQuery<
    GetReturnsInPeriod['responses']['200']['content']['application/json']
  >({
    queryKey: ['kpi-returns-in-period', query],
    queryFn: () =>
      apiFetch<
        GetReturnsInPeriod['responses']['200']['content']['application/json']
      >(apiPaths.kpiAdmin.returnsInPeriod(query), {}, true),
    enabled: !!query?.start && !!query?.end
  })
}

export function useTotalReturnsInPeriod(
  query: GetTotalReturnsInPeriod['parameters']['query']
) {
  return useQuery<
    GetTotalReturnsInPeriod['responses']['200']['content']['application/json']
  >({
    queryKey: ['kpi-total-returns-in-period', query],
    queryFn: () =>
      apiFetch<
        GetTotalReturnsInPeriod['responses']['200']['content']['application/json']
      >(apiPaths.kpiAdmin.totalReturnsInPeriod(query), {}, true),
    enabled: !!query?.start && !!query?.end
  })
}

// --- Reseller KPIs ---
export function useMonthlySales(params?: { start?: string; end?: string }) {
  return useQuery({
    queryKey: ['kpi-my-space-monthly-sales', params],
    queryFn: async () => {
      const result = await apiFetch(
        apiPaths.kpiMySpace.monthlySales,
        {
          method: 'POST',
          body: JSON.stringify(params || {})
        },
        true
      )
      return result ?? []
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })
}

export function useAverageTicket(params?: { start?: string; end?: string }) {
  return useQuery<number>({
    queryKey: ['kpi-my-space-average-ticket', params],
    queryFn: async () => {
      const result = await apiFetch<number>(
        apiPaths.kpiMySpace.averageTicket,
        {
          method: 'POST',
          body: JSON.stringify(params || {})
        },
        true
      )
      return result ?? 0
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })
}

export function useCurrentInventory(params?: { start?: string; end?: string }) {
  return useQuery({
    queryKey: ['kpi-my-space-current-inventory', params],
    queryFn: async () => {
      const result = await apiFetch(
        apiPaths.kpiMySpace.currentInventory,
        {
          method: 'POST',
          body: JSON.stringify(params || {})
        },
        true
      )
      return result ?? []
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })
}

export function useTopSellingProducts(params?: {
  start?: string
  end?: string
}) {
  return useQuery({
    queryKey: ['kpi-my-space-top-selling-products', params],
    queryFn: async () => {
      const result = await apiFetch(
        apiPaths.kpiMySpace.topSellingProducts,
        {
          method: 'POST',
          body: JSON.stringify(params || {})
        },
        true
      )
      return result ?? []
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })
}

export function useLongestTimeInInventory(params?: {
  start?: string
  end?: string
}) {
  return useQuery({
    queryKey: ['kpi-my-space-longest-time-in-inventory', params],
    queryFn: async () => {
      const result = await apiFetch(
        apiPaths.kpiMySpace.longestTimeInInventory,
        {
          method: 'POST',
          body: JSON.stringify(params || {})
        },
        true
      )
      return result ?? []
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })
}

export function useReturnCount(params?: { start?: string; end?: string }) {
  return useQuery<number>({
    queryKey: ['kpi-my-space-return-count', params],
    queryFn: async () => {
      const result = await apiFetch<number>(
        apiPaths.kpiMySpace.returnCount,
        {
          method: 'POST',
          body: JSON.stringify(params || {})
        },
        true
      )
      return result ?? 0
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })
}
