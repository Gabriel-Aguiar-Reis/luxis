import { ProductInStockDto } from '@/modules/kpi/admin/application/dtos/product/product-in-stock.dto'
import { ProductWithResellerDto } from '@/modules/kpi/admin/application/dtos/product/product-with-reseller.dto'
import { ParamsDto } from '@/shared/common/dtos/params.dto'

export abstract class ProductReadRepository {
  abstract productsInStock(qParams: ParamsDto): Promise<ProductInStockDto[]>
  abstract totalProductsInStock(qParams: ParamsDto): Promise<number>
  abstract productsWithResellers(
    qParams: ParamsDto
  ): Promise<ProductWithResellerDto[]>
  abstract totalProductsWithResellers(qParams: ParamsDto): Promise<number>
  abstract productsInStockForMoreThanXDays(
    days: number,
    qParams: ParamsDto
  ): Promise<ProductInStockDto[]>
  abstract totalProductsInStockForMoreThanXDays(
    days: number,
    qParams: ParamsDto
  ): Promise<number>
}
