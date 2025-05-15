import { ProductInStockDto } from '@/modules/kpi/application/dtos/product-in-stock.dto'
import { ProductWithResellerDto } from '@/modules/kpi/application/dtos/product-with-reseller.dto'

export abstract class ProductReadRepository {
  abstract totalProductsInStock(): Promise<number>
  abstract totalProductsWithResellers(): Promise<number>
  abstract productsInStock(): Promise<ProductInStockDto[]>
  abstract productsWithResellers(): Promise<ProductWithResellerDto[]>
}
