import { ModelName } from '@/modules/product-model/domain/value-objects/model-name.vo'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { Description } from '@/shared/common/value-object/description.vo'
import { ImageURL } from '@/modules/product-model/domain/value-objects/image-url.vo'
import { UUID } from 'crypto'
import { ApiProperty } from '@nestjs/swagger'

export class ProductModel {
  @ApiProperty({
    description: 'The ID of the product model',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public readonly id: UUID

  @ApiProperty({
    description: 'The name of the product model',
    example: 'iPhone 13 Pro Max',
    type: String
  })
  public name: ModelName

  @ApiProperty({
    description: 'The ID of the category',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public categoryId: UUID

  @ApiProperty({
    description: 'The suggested price of the product model',
    example: '999.99',
    type: String
  })
  public suggestedPrice: Currency

  @ApiProperty({
    description: 'The description of the product model',
    example: 'Latest iPhone model with advanced features',
    type: String,
    required: false
  })
  public description?: Description

  @ApiProperty({
    description: 'The URL of the product model photo',
    example: 'https://example.com/iphone13.jpg',
    type: String,
    required: false
  })
  public photoUrl?: ImageURL

  constructor(
    id: UUID,
    name: ModelName,
    categoryId: UUID,
    suggestedPrice: Currency,
    description?: Description,
    photoUrl?: ImageURL
  ) {
    this.id = id
    this.name = name
    this.categoryId = categoryId
    this.suggestedPrice = suggestedPrice
    this.description = description
    this.photoUrl = photoUrl
  }
}
