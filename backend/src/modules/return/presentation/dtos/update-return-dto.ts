import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator'
import { UUID } from 'crypto'

export class UpdateReturnDto {
  @IsUUID()
  resellerId: UUID

  @IsArray()
  @ArrayNotEmpty()
  items: UUID[]
}
