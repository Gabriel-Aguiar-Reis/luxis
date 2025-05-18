import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
import { ApiProperty } from '@nestjs/swagger'
import { UUID } from 'crypto'

export class ProductInStockDto {
  @ApiProperty({
    description: 'The ID of the product',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public readonly id: UUID

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
  public modelId: UUID

  @ApiProperty({
    description: 'The name of the product model',
    example: 'iPhone 13 Pro Max',
    type: String
  })
  public modelName: string

  @ApiProperty({
    description: 'The ID of the batch',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public batchId: UUID

  @ApiProperty({
    description: 'The unit cost of the product',
    example: '100.00',
    type: String
  })
  public unitCost: string

  @ApiProperty({
    description: 'The sale price of the product',
    example: '150.00',
    type: String
  })
  public salePrice: string

  @ApiProperty({
    description: 'The status of the product',
    enum: ProductStatus,
    example: ProductStatus.IN_STOCK,
    type: String
  })
  public status: string
}
