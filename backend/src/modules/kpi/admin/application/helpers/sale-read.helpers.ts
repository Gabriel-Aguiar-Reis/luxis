// Helpers para SaleReadTypeormRepository
import { UUID } from 'crypto'
import { SaleReturnProductDto } from '@/modules/kpi/admin/application/dtos/sale/sale-return-product.dto'

export function buildProductMap(
  products: SaleReturnProductDto[]
): Map<UUID, SaleReturnProductDto> {
  const productMap = new Map<UUID, SaleReturnProductDto>()
  products.forEach((p) => productMap.set(p.productId, p))
  return productMap
}

export function mapProducts(
  productIds: UUID[],
  productMap: Map<UUID, SaleReturnProductDto>
) {
  return productIds.map((pid) => {
    const product = productMap.get(pid)!
    return {
      productId: product.productId,
      productModelId: product.productModelId,
      productModelName: product.productModelName,
      salePrice: product.salePrice
    }
  })
}
