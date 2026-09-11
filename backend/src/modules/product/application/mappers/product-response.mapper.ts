import { ProductResponseDto } from '@/modules/product/application/dtos/product-response.dto'
import { Product } from '@/modules/product/domain/entities/product.entity'

export class ProductResponseMapper {
  static toDto(product: Product): ProductResponseDto {
    return {
      id: product.id,
      serialNumber: product.serialNumber.getValue(),
      modelId: product.modelId,
      batchId: product.batchId,
      unitCost: product.unitCost.getValue(),
      salePrice: product.salePrice.getValue(),
      status: product.status
    }
  }

  static toDtoList(products: Product[]): ProductResponseDto[] {
    return products.map((product) => ProductResponseMapper.toDto(product))
  }
}
