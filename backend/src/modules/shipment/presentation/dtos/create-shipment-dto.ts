import { ArrayNotEmpty, IsArray, IsNotEmpty, IsUUID } from 'class-validator'
import { UUID } from 'crypto'

export class CreateShipmentDto {
  @IsUUID()
  @IsNotEmpty()
  resellerId: UUID

  @IsArray()
  @ArrayNotEmpty()
  productIds: UUID[] = []
}
