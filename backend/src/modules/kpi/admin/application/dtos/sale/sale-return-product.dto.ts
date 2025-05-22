import { ApiProperty } from '@nestjs/swagger'
import { UUID } from 'crypto'

export class SaleReturnProductDto {
  @ApiProperty({
    description: 'The ID of the product',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public productId: UUID

  @ApiProperty({
    description: 'The ID of the product model',
    example: '123e4567-e89b-12d3-a456-426614174001',
    type: String
  })
  public productModelId: UUID

  @ApiProperty({
    description: 'The name of the product model',
    example: 'iPhone 13 Pro Max',
    type: String
  })
  public productModelName: string

  @ApiProperty({
    description: 'The sale price of the product',
    example: 150.0,
    type: Number
  })
  public salePrice: number
}
