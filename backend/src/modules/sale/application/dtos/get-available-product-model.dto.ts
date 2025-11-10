import { ImageURL } from '@/modules/product-model/domain/value-objects/image-url.vo'
import { ModelName } from '@/modules/product-model/domain/value-objects/model-name.vo'
import { GetSaleProductDto } from '@/modules/sale/application/dtos/get-sale-product.dto'
import { ApiProperty } from '@nestjs/swagger'
import { UUID } from 'crypto'

export class GetAvailableProductModelDto {
  @ApiProperty({
    description: 'The ID of the product model',
    example: '123e4567-e89b-12d3-a456-426614174001',
    type: String,
    required: true
  })
  id: UUID

  @ApiProperty({
    description: 'The name of the product model',
    example: 'Product Model Name',
    type: ModelName,
    required: true
  })
  modelName: ModelName

  @ApiProperty({
    description: 'The image URL of the product model',
    example: 'https://example.com/product-model.jpg',
    type: ImageURL,
    required: false
  })
  imageUrl?: ImageURL

  @ApiProperty({
    description: 'The available products for the model',
    type: [GetSaleProductDto],
    required: true
  })
  products: GetSaleProductDto[]
}
