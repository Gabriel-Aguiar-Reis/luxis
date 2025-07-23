import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
import { SerialNumber } from '@/modules/product/domain/value-objects/serial-number.vo'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { UUID } from 'crypto'
import { ApiProperty } from '@nestjs/swagger'

export class Product {
  @ApiProperty({
    description: 'The ID of the product',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public readonly id: UUID

  @ApiProperty({
    description: 'The serial number of the product',
    example: '0424A-BR-BAB-001',
    type: SerialNumber
  })
  public serialNumber: SerialNumber

  @ApiProperty({
    description: 'The ID of the product model',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public modelId: UUID

  @ApiProperty({
    description: 'The ID of the batch',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public batchId: UUID

  @ApiProperty({
    description: 'The unit cost of the product',
    example: '100.00',
    type: Currency
  })
  public unitCost: Currency

  @ApiProperty({
    description: 'The sale price of the product',
    example: '150.00',
    type: Currency
  })
  public salePrice: Currency

  @ApiProperty({
    description: 'The status of the product',
    enum: ProductStatus,
    example: ProductStatus.IN_STOCK,
  })
  public status: ProductStatus

  constructor(
    id: UUID,
    serialNumber: SerialNumber,
    modelId: UUID,
    batchId: UUID,
    unitCost: Currency,
    salePrice: Currency,
    status: ProductStatus = ProductStatus.IN_STOCK
  ) {
    this.id = id
    this.serialNumber = serialNumber
    this.modelId = modelId
    this.batchId = batchId
    this.unitCost = unitCost
    this.salePrice = salePrice
    this.status = status
  }
}
