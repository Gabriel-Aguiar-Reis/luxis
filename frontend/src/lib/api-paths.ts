export const apiPaths = {
  // Batches
  batches: {
    base: '/batches',
    byId: (id: string) => `/batches/${id}`
  },

  // Categories
  categories: {
    base: '/categories',
    byId: (id: string) => `/categories/${id}`,
    status: (id: string) => `/categories/${id}/status`
  },

  // Ownership Transfers
  ownershipTransfers: {
    base: '/ownership-transfers',
    byId: (id: string) => `/ownership-transfers/${id}`,
    status: (id: string) => `/ownership-transfers/${id}/status`
  },

  // Inventory
  inventory: {
    byId(id: string) {
      return `/inventory/${id}`
    }
  },

  // KPI - Ownership Transfers (Admin)
  kpiOwnershipTransfers: {
    byResellerId: (id: string) =>
      `/kpi/admin/ownership-transfers/by-reseller/${id}`,
    totalByResellerId: (id: string) =>
      `/kpi/admin/ownership-transfers/by-reseller/${id}/total`,
    inPeriod: (query: { start: string; end: string }) =>
      `/kpi/admin/ownership-transfers/in-period?start=${query.start}&end=${query.end}`,
    totalInPeriod: (query: { start: string; end: string }) =>
      `/kpi/admin/ownership-transfers/in-period/total?start=${query.start}&end=${query.end}`,
    receivedByResellerId: (id: string) =>
      `/kpi/admin/ownership-transfers/received/by-reseller/${id}`,
    totalReceivedByResellerId: (id: string) =>
      `/kpi/admin/ownership-transfers/received/by-reseller/${id}/total`,
    givenByResellerId: (id: string) =>
      `/kpi/admin/ownership-transfers/given/by-reseller/${id}`,
    totalGivenByResellerId: (id: string) =>
      `/kpi/admin/ownership-transfers/given/by-reseller/${id}/total`
  },

  // Products
  products: {
    base: '/products',
    available: '/products/available/in-stock',
    byId: (id: string) => `/products/${id}`,
    sell: (id: string) => `/products/${id}/sell`
  },

  // Product Models
  productModels: {
    base: '/product-models',
    byId: (id: string) => `/product-models/${id}`,
    cloudinarySignature: '/product-models/cloudinary-signature'
  },

  // Sales
  sales: {
    base: '/sales',
    byId: (id: string) => `/sales/${id}`,
    markInstallmentPaid: (id: string) => `/sales/${id}/installments/mark-paid`,
    status: (id: string) => `/sales/${id}/status`,
    availableProducts: '/sales/available-products',
    confirm: (id: string) => `/sales/${id}/confirm`
  },

  // Shipments
  shipments: {
    base: '/shipments',
    byId: (id: string) => `/shipments/${id}`,
    status: (id: string) => `/shipments/${id}/status`
  },

  // Users
  users: {
    base: '/users',
    signup: '/users/signup',
    byId: (id: string) => `/users/${id}`,
    role: (id: string) => `/users/${id}/role`,
    status: (id: string) => `/users/${id}/status`,
    disable: (id: string) => `/users/${id}/disable`,
    products: (id: string) => `/users/${id}/products`,
    pending: '/users/pending'
  },

  // Suppliers
  suppliers: {
    base: '/suppliers',
    byId: (id: string) => `/suppliers/${id}`
  },

  // Returns
  returns: {
    base: '/returns',
    byId: (id: string) => `/returns/${id}`,
    status: (id: string) => `/returns/${id}/status`,
    reseller: (resellerId: string) => `/returns/reseller/${resellerId}`
  },

  // Customers
  customers: {
    base: '/customers',
    byId: (id: string) => `/customers/${id}`,
    delete: (id: string, fromResellerId: string) =>
      `/customers/${id}/from/${fromResellerId}`,
    transfer: (id: string) => `/customers/${id}/transfer`
  },

  // Auth
  auth: {
    login: '/auth/login',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    changePassword: '/auth/change-password',
    verify: '/auth/verify'
  },

  // KPI - Admin
  kpiAdmin: {
    productsInStockTotal: '/kpi/admin/products/in-stock/total',
    productsInStock: '/kpi/admin/products/in-stock',
    productsWithResellers: '/kpi/admin/products/with-resellers',
    productsWithResellersTotal: '/kpi/admin/products/with-resellers/total',
    productsInStockForMoreThan: (days: number) =>
      `/kpi/admin/products/in-stock/for-more-than/${days}`,
    productsInStockForMoreThanTotal: (days: number) =>
      `/kpi/admin/products/in-stock/for-more-than/${days}/total`,
    sales: '/kpi/admin/sales',
    salesTotal: '/kpi/admin/sales/total',
    salesByResellers: '/kpi/admin/sales/resellers',
    salesByResellersTotal: '/kpi/admin/sales/resellers/total',
    salesByResellerId: (id: string) => `/kpi/admin/sales/resellers/${id}`,
    salesTotalByResellerId: (id: string) =>
      `/kpi/admin/sales/resellers/${id}/total`,
    totalBillingByResellerId: (resellerId: string) =>
      `/kpi/admin/sales/billing/resellers/${resellerId}`,
    totalBillingByBatchId: (id: string) =>
      `/kpi/admin/sales/billing/batch/${id}`,

    totalBillingByPeriod: (params: {
      start: string
      end: string
      limit?: number
      page?: number
    }) => {
      let url = `/kpi/admin/sales/billing/period`
      url = apiPaths.kpiAdmin.withPeriod(url, {
        start: params.start,
        end: params.end
      })
      if (params.limit && params.page) {
        url = apiPaths.kpiAdmin.withLimitAndPage(url, {
          limit: params.limit,
          page: params.page
        })
      }
      return url
    },

    // Helpers for query params
    withPeriod: (base: string, params: { start: string; end: string }) =>
      `${base}${`?start=${params.start}`}${`&end=${params.end}`}`,

    withLimitAndPage: (
      base: string,
      params: { limit: number; page: number }
    ) =>
      base.includes('?')
        ? `${base}&limit=${params.limit}&page=${params.page}`
        : `${base}?limit=${params.limit}&page=${params.page}`,

    salesByPeriod: (params: {
      start: string
      end: string
      limit?: number
      page?: number
    }) => {
      let url = `/kpi/admin/sales`
      url = apiPaths.kpiAdmin.withPeriod(url, {
        start: params.start,
        end: params.end
      })
      if (params.limit) {
        url += `&limit=${params.limit}`
        if (params.page) {
          url += `&page=${params.page}`
        }
      }
      return url
    },
    salesByPeriodTotal: (params: { start: string; end: string }) =>
      `/kpi/admin/sales/total?start=${params.start}&end=${params.end}`,

    salesAggregatedByDay: (params: { start: string; end: string }) =>
      `/kpi/admin/sales/aggregated-by-day?start=${params.start}&end=${params.end}`,

    // --- Ownership Transfers ---
    ownershipTransfersByResellerId: (id: string) =>
      `/kpi/admin/ownership-transfers/by-reseller/${id}`,
    totalOwnershipTransfersByResellerId: (id: string) =>
      `/kpi/admin/ownership-transfers/by-reseller/${id}/total`,
    ownershipTransfersInPeriod: (query: { start: string; end: string }) =>
      `/kpi/admin/ownership-transfers/in-period?start=${query.start}&end=${query.end}`,
    totalOwnershipTransfersInPeriod: (query: { start: string; end: string }) =>
      `/kpi/admin/ownership-transfers/in-period/total?start=${query.start}&end=${query.end}`,
    ownershipTransfersReceivedByResellerId: (id: string) =>
      `/kpi/admin/ownership-transfers/received/by-reseller/${id}`,
    totalOwnershipTransfersReceivedByResellerId: (id: string) =>
      `/kpi/admin/ownership-transfers/received/by-reseller/${id}/total`,
    ownershipTransfersGivenByResellerId: (id: string) =>
      `/kpi/admin/ownership-transfers/given/by-reseller/${id}`,
    totalOwnershipTransfersGivenByResellerId: (id: string) =>
      `/kpi/admin/ownership-transfers/given/by-reseller/${id}/total`,

    returnsByResellerId: (id: string) => `/kpi/admin/returns/by-reseller/${id}`,
    returnsByReseller: `/kpi/admin/returns/by-reseller`,
    returnsInPeriod: (query: { start: string; end: string }) =>
      `/kpi/admin/returns/in-period?start=${query.start}&end=${query.end}`,
    totalReturnsByResellerId: (id: string) =>
      `/kpi/admin/returns/by-reseller/${id}/total`,
    totalReturnsByReseller: `/kpi/admin/returns/by-resellers/total`,
    totalReturnsInPeriod: (query: { start: string; end: string }) =>
      `/kpi/admin/returns/in-period/total?start=${query.start}&end=${query.end}`
  },

  // KPI - My Space / Reseller
  kpiMySpace: {
    monthlySales: '/kpi/my-space/sales/monthly',
    averageTicket: '/kpi/my-space/sales/average-ticket',
    currentInventory: '/kpi/my-space/inventory/current',
    topSellingProducts: '/kpi/my-space/products/top-selling',
    longestTimeInInventory: '/kpi/my-space/products/longest-time-in-inventory',
    returnCount: '/kpi/my-space/returns/count'
  }
} as const

export type ApiPaths = typeof apiPaths
