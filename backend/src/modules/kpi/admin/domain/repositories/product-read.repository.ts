import { ProductInStockDto } from '@/modules/kpi/admin/application/dtos/product/product-in-stock.dto'
import { ProductWithResellerDto } from '@/modules/kpi/admin/application/dtos/product/product-with-reseller.dto'

export abstract class ProductReadRepository {
  abstract productsInStock(
    start?: Date,
    end?: Date
  ): Promise<ProductInStockDto[]>
  abstract totalProductsInStock(start?: Date, end?: Date): Promise<number>
  abstract productsWithResellers(
    start?: Date,
    end?: Date
  ): Promise<ProductWithResellerDto[]>
  abstract totalProductsWithResellers(start?: Date, end?: Date): Promise<number>
}
