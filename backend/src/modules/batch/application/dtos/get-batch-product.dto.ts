import { ModelName } from "@/modules/product-model/domain/value-objects/model-name.vo"
import { Product } from "@/modules/product/domain/entities/product.entity"
import { ApiProperty } from "@nestjs/swagger"

export class GetBatchProductDto extends Product {
  @ApiProperty({
    description: 'The name of the product model',
    example: 'iPhone 13',
    type: ModelName
  })
  modelName: ModelName

  @ApiProperty({
    description: 'The quantity of the product',
    example: 100,
    type: Number
  })
  quantity: number
}