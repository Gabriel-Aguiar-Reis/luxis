import { ArrayNotEmpty, IsArray, IsOptional } from 'class-validator'
import { IsUUID } from 'class-validator'
import { UUID } from 'crypto'

export class CreateReturnDto {
  @IsUUID()
  @IsOptional()
  resellerId: UUID

  @IsArray()
  @ArrayNotEmpty()
  items: UUID[]
}
