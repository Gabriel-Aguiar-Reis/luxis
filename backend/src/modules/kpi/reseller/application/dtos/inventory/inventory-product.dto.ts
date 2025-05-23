import { ApiProperty } from '@nestjs/swagger'

export class InventoryProductDto {
  @ApiProperty({
    description: 'The ID of the product',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public id: string

  @ApiProperty({
    description: 'The serial number of the product',
    example: 'SN20240101001',
    type: String
  })
  public serialNumber: string

  @ApiProperty({
    description: 'The sale price of the product',
    example: '150.00',
    type: String
  })
  public salePrice: string
}
