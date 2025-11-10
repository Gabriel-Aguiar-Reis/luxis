import { IsEnum, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ShipmentStatus } from '@/modules/shipment/domain/enums/shipment-status.enum'

export class UpdateStatusShipmentDto {
  @ApiProperty({
    description: 'The status of the shipment',
    example: ShipmentStatus.DELIVERED,
    enum: ShipmentStatus,
    required: true
  })
  @IsEnum(ShipmentStatus)
  @IsNotEmpty()
  status: ShipmentStatus
}
