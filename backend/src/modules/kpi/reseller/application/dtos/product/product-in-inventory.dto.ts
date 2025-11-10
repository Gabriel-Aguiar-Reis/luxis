import { ApiProperty } from '@nestjs/swagger'

export class ProductInInventoryDto {
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
    description: 'The ID of the product model',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public modelId: string

  @ApiProperty({
    description: 'The name of the product model',
    example: 'iPhone 13 Pro Max',
    type: String
  })
  public modelName: string

  @ApiProperty({
    description: 'The sale price of the product',
    example: '150.00',
    type: String
  })
  public salePrice: string

  @ApiProperty({
    description: 'The date when the product was acquired (batch arrival date)',
    example: '2024-01-01T00:00:00.000Z',
    type: String
  })
  public dateAcquired: string
}
