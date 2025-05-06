import { ShipmentStatus } from '@/modules/shipment/domain/enums/shipment-status.enum'
import { UUID } from 'crypto'
import { ApiProperty } from '@nestjs/swagger'

export class Shipment {
  @ApiProperty({
    description: 'The ID of the shipment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public readonly id: UUID

  @ApiProperty({
    description: 'The ID of the reseller',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public resellerId: UUID

  @ApiProperty({
    description: 'The creation date of the shipment',
    example: '2024-01-01',
    type: Date
  })
  public readonly createdAt: Date

  @ApiProperty({
    description: 'The status of the shipment',
    enum: ShipmentStatus,
    example: ShipmentStatus.PENDING,
    type: String
  })
  public status: ShipmentStatus

  @ApiProperty({
    description: 'The IDs of the products in the shipment',
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001'
    ],
    type: [String]
  })
  public productIds: UUID[]

  constructor(
    id: UUID,
    resellerId: UUID,
    createdAt: Date,
    status: ShipmentStatus = ShipmentStatus.PENDING,
    productIds: UUID[] = []
  ) {
    this.id = id
    this.resellerId = resellerId
    this.createdAt = createdAt
    this.status = status
    this.productIds = productIds
  }
}
