import { ShipmentProductDto } from "@/modules/shipment/application/dtos/shipment-product.dto"
import { ShipmentStatus } from "@/modules/shipment/domain/enums/shipment-status.enum"
import { ApiProperty } from "@nestjs/swagger"
import { UUID } from "crypto"

export class GetShipmentDto {
  @ApiProperty({
    description: 'The ID of the shipment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public readonly id: UUID

  @ApiProperty({
    description: 'The ID of the reseller associated with the shipment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public readonly resellerId: UUID

  @ApiProperty({
    description: 'The name of the reseller associated with the shipment',
    example: 'John Doe',
    type: String
  })
  public readonly resellerName: string
  @ApiProperty({
    description: 'The creation date of the shipment',
    example: '2023-10-05T14:48:00.000Z',
    type: Date,
  })
  public readonly createdAt: Date

  @ApiProperty({
    description: 'The status of the shipment',
    enum: ShipmentStatus,
    example: ShipmentStatus.PENDING,
  })
  public readonly status: ShipmentStatus

  @ApiProperty({
    description: 'The products included in the shipment',
    type: [ShipmentProductDto]
  })
  public readonly products: ShipmentProductDto[]
}