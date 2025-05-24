import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { UUID } from 'crypto'
import { ProductInInventoryDto } from '@/modules/kpi/reseller/application/dtos/product/product-in-inventory.dto'
import { SellingProductDto } from '@/modules/kpi/reseller/application/dtos/product/selling-product.dto'

export abstract class ProductReadRepository {
  abstract topSellingProducts(
    resellerId: UUID,
    qParams: ParamsDto
  ): Promise<SellingProductDto[]>

  abstract productsWithLongestTimeInInventory(
    resellerId: UUID,
    qParams: ParamsDto
  ): Promise<ProductInInventoryDto[]>
}
