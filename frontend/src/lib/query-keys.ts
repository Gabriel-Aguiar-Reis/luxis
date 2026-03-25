export const queryKeys = {
  batches: {
    all: () => ['batches'] as const
  },
  categories: {
    all: () => ['categories'] as const
  },
  customers: {
    all: () => ['customers'] as const
  },
  inventory: {
    detail: (resellerId: string) => ['inventory', resellerId] as const
  },
  kpis: {
    admin: {
      totalInStockProducts: () => ['kpi-total-in-stock-products'] as const,
      productsInStock: () => ['kpi-products-in-stock'] as const,
      productsWithResellers: () => ['kpi-products-with-resellers'] as const,
      totalProductsWithResellers: () =>
        ['kpi-total-products-with-resellers'] as const,
      productsInStockForMoreThan: (days: number) =>
        ['kpi-products-in-stock-for-more-than', days] as const,
      totalProductsInStockForMoreThan: (days: number) =>
        ['kpi-total-products-in-stock-for-more-than', days] as const,
      salesByReseller: (id: string) => ['kpi-sales-by-reseller', id] as const,
      totalSalesByReseller: (id: string) =>
        ['kpi-total-sales-by-reseller', id] as const,
      salesInPeriod: (query: unknown) =>
        ['kpi-sales-in-period', query] as const,
      totalSalesInPeriod: (query: unknown) =>
        ['kpi-total-sales-in-period', query] as const,
      salesAggregatedByDay: (query: unknown) =>
        ['kpi-sales-aggregated-by-day', query] as const,
      salesByResellerList: (query: unknown) =>
        ['kpi-sales-by-reseller-list', query] as const,
      totalSalesByResellerList: (query: unknown) =>
        ['kpi-total-sales-by-reseller-list', query] as const,
      totalBillingByBatch: (id: string) =>
        ['kpi-total-billing-by-batch', id] as const,
      totalBillingByReseller: (resellerId: string) =>
        ['kpi-total-billing-by-reseller', resellerId] as const,
      totalBillingByPeriod: (query: unknown) =>
        ['kpi-total-billing-by-period', query] as const,
      ownershipTransfersByReseller: (id: string) =>
        ['kpi-ownership-transfers-by-reseller', id] as const,
      totalOwnershipTransfersByReseller: (id: string) =>
        ['kpi-total-ownership-transfers-by-reseller', id] as const,
      ownershipTransfersInPeriod: (query: unknown) =>
        ['kpi-ownership-transfers-in-period', query] as const,
      totalOwnershipTransfersInPeriod: (query: unknown) =>
        ['kpi-total-ownership-transfers-in-period', query] as const,
      ownershipTransfersReceivedByReseller: (id: string) =>
        ['kpi-ownership-transfers-received-by-reseller', id] as const,
      totalOwnershipTransfersReceivedByReseller: (id: string) =>
        ['kpi-total-ownership-transfers-received-by-reseller', id] as const,
      ownershipTransfersGivenByReseller: (id: string) =>
        ['kpi-ownership-transfers-given-by-reseller', id] as const,
      totalOwnershipTransfersGivenByReseller: (id: string) =>
        ['kpi-total-ownership-transfers-given-by-reseller', id] as const,
      returnsByReseller: (id: string) =>
        ['kpi-returns-by-reseller', id] as const,
      totalReturnsByReseller: (id: string) =>
        ['kpi-total-returns-by-reseller', id] as const,
      returnsByResellerList: (query: unknown) =>
        ['kpi-returns-by-reseller-list', query] as const,
      totalReturnsByResellerList: (query: unknown) =>
        ['kpi-total-returns-by-reseller-list', query] as const,
      returnsInPeriod: (query: unknown) =>
        ['kpi-returns-in-period', query] as const,
      totalReturnsInPeriod: (query: unknown) =>
        ['kpi-total-returns-in-period', query] as const
    },
    mySpace: {
      monthlySales: (params: unknown) =>
        ['kpi-my-space-monthly-sales', params] as const,
      averageTicket: (params: unknown) =>
        ['kpi-my-space-average-ticket', params] as const,
      currentInventory: (params: unknown) =>
        ['kpi-my-space-current-inventory', params] as const,
      topSellingProducts: (params: unknown) =>
        ['kpi-my-space-top-selling-products', params] as const,
      longestTimeInInventory: (params: unknown) =>
        ['kpi-my-space-longest-time-in-inventory', params] as const,
      returnCount: (params: unknown) =>
        ['kpi-my-space-return-count', params] as const
    }
  },
  passwordResetRequests: {
    all: () => ['password-reset-requests'] as const
  },
  productModels: {
    all: () => ['product-models'] as const
  },
  profile: {
    current: () => ['profile'] as const
  },
  products: {
    all: () => ['products'] as const,
    available: () => ['products', 'available'] as const
  },
  returns: {
    all: () => ['returns'] as const
  },
  sales: {
    all: () => ['sales'] as const,
    detail: (id: string) => ['sale', id] as const,
    availableProducts: () => ['available-products-to-sell'] as const
  },
  shipments: {
    all: () => ['shipments'] as const
  },
  suppliers: {
    all: () => ['suppliers'] as const
  },
  transfers: {
    all: () => ['transfers'] as const
  },
  users: {
    all: () => ['users'] as const,
    pending: () => ['pending-users'] as const,
    products: (userId: string) => ['user-products', userId] as const
  }
} as const
