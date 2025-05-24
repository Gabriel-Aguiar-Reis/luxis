import { ApiProperty } from '@nestjs/swagger'

export class SellingProductDto {
  @ApiProperty({
    description: 'The ID of the product model',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  modelId: string

  @ApiProperty({
    description: 'The name of the product model',
    example: 'iPhone 13 Pro Max',
    type: String
  })
  modelName: string

  @ApiProperty({
    description: 'The quantity of the product',
    example: 10,
    type: Number
  })
  quantity: number

  @ApiProperty({
    description: 'The sale price of the product',
    example: '150.00',
    type: String
  })
  salePrice: string

  @ApiProperty({
    description: 'The total value of the product',
    example: '1500.00',
    type: String
  })
  totalValue: string
}
