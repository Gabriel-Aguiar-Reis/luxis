import { ArrayNotEmpty, IsArray, IsNotEmpty, IsUUID } from 'class-validator'
import { UUID } from 'crypto'

export class UpdateShipmentDto {
  @IsUUID()
  @IsNotEmpty()
  resellerId: UUID

  @IsArray()
  @ArrayNotEmpty()
  productIds: UUID[] = []
}
