import { paths, components } from '@/types/openapi'

// Params

export type ParamsDto = components['schemas']['ParamsDto']
export type ParamsWithMandatoryPeriodDto =
  components['schemas']['ParamsWithMandatoryPeriodDto']

// Batches

export type Batch = components['schemas']['Batch']
export type GetAllBatches = paths['/batches']['get']
export type GetOneBatch = paths['/batches/{id}']['get']
export type PostBatch = paths['/batches']['post']
export type GetBatch = paths['/batches/{id}']['get']
export type DeleteBatch = paths['/batches/{id}']['delete']

// Categories

export type Category = components['schemas']['Category']
export type GetAllCategories = paths['/categories']['get']
export type GetOneCategory = paths['/categories/{id}']['get']
export type PostCategory = paths['/categories']['post']
export type DeleteCategory = paths['/categories/{id}']['delete']
export type UpdateCategory = paths['/categories/{id}']['patch']
export type UpdateCategoryStatus = paths['/categories/{id}/status']['patch']

// Ownership-transfers

export type OwnershipTransfer = components['schemas']['OwnershipTransfer']
export type GetAllOwnershipTransfers = paths['/ownership-transfers']['get']
export type GetOneOwnershipTransfer = paths['/ownership-transfers/{id}']['get']
export type PostOwnershipTransfer = paths['/ownership-transfers']['post']
export type DeleteOwnershipTransfer =
  paths['/ownership-transfers/{id}']['delete']
export type UpdateOwnershipTransfer =
  paths['/ownership-transfers/{id}']['patch']
export type UpdateOwnershipTransferStatus =
  paths['/ownership-transfers/{id}/status']['patch']

// Products

export type Product = components['schemas']['Product']
export type GetAllProducts = paths['/products']['get']
export type GetOneProduct = paths['/products/{id}']['get']
export type DeleteProduct = paths['/products/{id}']['delete']
export type UpdateProduct = paths['/products/{id}']['patch']
export type UpdateProductStatus = paths['/products/{id}/sell']['patch']

// Product-models

export type ProductModel = components['schemas']['ProductModel']
export type GetAllProductModels = paths['/product-models']['get']
export type GetOneProductModel = paths['/product-models/{id}']['get']
export type PostProductModel = paths['/product-models']['post']
export type DeleteProductModel = paths['/product-models/{id}']['delete']
export type UpdateProductModel = paths['/product-models/{id}']['patch']

// Sales

export type Sale = components['schemas']['Sale']
export type GetAllSales = paths['/sales']['get']
export type GetOneSale = paths['/sales/{id}']['get']
export type PostSale = paths['/sales']['post']
export type DeleteSale = paths['/sales/{id}']['delete']
export type UpdateSale = paths['/sales/{id}']['patch']
export type UpdateSaleInstallmentToPaid =
  paths['/sales/{id}/installments/mark-paid']['patch']

// Shipments

export type Shipment = components['schemas']['Shipment']
export type GetAllShipments = paths['/shipments']['get']
export type GetOneShipment = paths['/shipments/{id}']['get']
export type PostShipment = paths['/shipments']['post']
export type DeleteShipment = paths['/shipments/{id}']['delete']
export type UpdateShipment = paths['/shipments/{id}']['patch']
export type UpdateShipmentStatus = paths['/shipments/{id}/status']['patch']

// Users

export type User = components['schemas']['User']
export type FederativeUnit = components['schemas']['FederativeUnit']
export type Country = components['schemas']['Country']
export type UserRole = components['schemas']['Role']
export type UserStatus = components['schemas']['UserStatus']
export type GetAllUsers = paths['/users']['get']
export type GetOneUser = paths['/users/{id}']['get']
export type PostUser = paths['/users/signup']['post']
export type DeleteUser = paths['/users/{id}']['delete']
export type UpdateUser = paths['/users/{id}']['patch']
export type UpdateUserRole = paths['/users/{id}/role']['patch']
export type UpdateUserStatus = paths['/users/{id}/status']['patch']
export type DisableUser = paths['/users/{id}/disable']['patch']

// Suppliers

export type Supplier = components['schemas']['Supplier']
export type GetAllSuppliers = paths['/suppliers']['get']
export type GetOneSupplier = paths['/suppliers/{id}']['get']
export type PostSupplier = paths['/suppliers']['post']
export type DeleteSupplier = paths['/suppliers/{id}']['delete']
export type UpdateSupplier = paths['/suppliers/{id}']['patch']

// Returns

export type Return = components['schemas']['Return']
export type GetAllReturns = paths['/returns']['get']
export type GetOneReturn = paths['/returns/{id}']['get']
export type PostReturn = paths['/returns']['post']
export type DeleteReturn = paths['/returns/{id}']['delete']
export type UpdateReturn = paths['/returns/{id}']['patch']
export type UpdateReturnStatus = paths['/returns/{id}/status']['patch']

// Customers

export type Customer = components['schemas']['Customer']
export type GetAllCustomers = paths['/customers']['get']
export type GetOneCustomer = paths['/customers/{id}']['get']
export type PostCustomer = paths['/customers']['post']
export type DeleteCustomer =
  paths['/customers/{id}/from/{fromResellerId}']['delete']
export type UpdateCustomer = paths['/customers/{id}']['patch']
export type TransferCustomerOwnership =
  paths['/customers/{id}/transfer']['post']

// Auth

export type Login = paths['/auth/login']['post']
export type ForgotPassword = paths['/auth/forgot-password']['post']
export type ResetPassword = paths['/auth/reset-password']['post']
export type ChangePassword = paths['/auth/change-password']['post']
export type Verify = paths['/auth/verify']['post']

// KPI - Admin

export type GetTotalInStockProducts =
  paths['/kpi/admin/products/in-stock/total']['get']
export type GetProductsInStock = paths['/kpi/admin/products/in-stock']['get']
export type GetProductsWithResellers =
  paths['/kpi/admin/products/with-resellers']['get']
export type GetTotalProductsWithResellers =
  paths['/kpi/admin/products/with-resellers/total']['get']
export type GetProductsInStockForMoreThanXDays =
  paths['/kpi/admin/products/in-stock/for-more-than/{days}']['get']
export type GetTotalProductsInStockForMoreThanXDays =
  paths['/kpi/admin/products/in-stock/for-more-than/{days}/total']['get']
export type GetSalesByResellerId =
  paths['/kpi/admin/sales/resellers/{id}']['get']
export type GetTotalSalesByResellerId =
  paths['/kpi/admin/sales/resellers/{id}/total']['get']
export type GetSalesInPeriod = paths['/kpi/admin/sales']['get']
export type GetTotalSalesInPeriod = paths['/kpi/admin/sales/total']['get']
export type GetSalesByReseller = paths['/kpi/admin/sales/resellers']['get']
export type GetTotalSalesByReseller =
  paths['/kpi/admin/sales/resellers/total']['get']
export type GetTotalBillingByBatchId =
  paths['/kpi/admin/sales/billing/batch/{id}']['get']
export type GetTotalBillingByResellerId =
  paths['/kpi/admin/sales/billing/resellers/{resellerId}']['get']
export type GetTotalBillingByPeriod =
  paths['/kpi/admin/sales/billing/period']['get']

// KPI - Admin (Ownership Transfers)
export type GetOwnershipTransfersByResellerId =
  paths['/kpi/admin/ownership-transfers/by-reseller/{id}']['get']
export type GetTotalOwnershipTransfersByResellerId =
  paths['/kpi/admin/ownership-transfers/by-reseller/{id}/total']['get']
export type GetOwnershipTransfersInPeriod =
  paths['/kpi/admin/ownership-transfers/in-period']['get']
export type GetTotalOwnershipTransfersInPeriod =
  paths['/kpi/admin/ownership-transfers/in-period/total']['get']
export type GetOwnershipTransfersReceivedByResellerId =
  paths['/kpi/admin/ownership-transfers/received/by-reseller/{id}']['get']
export type GetTotalOwnershipTransfersReceivedByResellerId =
  paths['/kpi/admin/ownership-transfers/received/by-reseller/{id}/total']['get']
export type GetOwnershipTransfersGivenByResellerId =
  paths['/kpi/admin/ownership-transfers/given/by-reseller/{id}']['get']
export type GetTotalOwnershipTransfersGivenByResellerId =
  paths['/kpi/admin/ownership-transfers/given/by-reseller/{id}/total']['get']

// KPI - Admin (Returns)
export type GetReturnsByResellerId =
  paths['/kpi/admin/returns/by-reseller/{id}']['get']
export type GetTotalReturnsByResellerId =
  paths['/kpi/admin/returns/by-reseller/{id}/total']['get']
export type GetReturnsByReseller =
  paths['/kpi/admin/returns/by-reseller']['get']
export type GetTotalReturnsByReseller =
  paths['/kpi/admin/returns/by-reseller/total']['get']
export type GetReturnsInPeriod = paths['/kpi/admin/returns/in-period']['get']
export type GetTotalReturnsInPeriod =
  paths['/kpi/admin/returns/in-period/total']['get']

// KPI - Reseller

export type GetMonthlySales = paths['/kpi/my-space/sales/monthly']['get']
export type GetAverageTicket =
  paths['/kpi/my-space/sales/average-ticket']['get']
export type GetCurrentInventory =
  paths['/kpi/my-space/inventory/current']['get']
export type GetTopSellingProducts =
  paths['/kpi/my-space/products/top-selling']['get']
export type GetProductsWithLongestTimeInInventory =
  paths['/kpi/my-space/products/longest-time-in-inventory']['get']
export type GetReturnsMadeByReseller =
  paths['/kpi/my-space/returns/count']['get']
