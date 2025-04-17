import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator'
import { UUID } from 'crypto'

export class CreatePackingListDto {
  @IsString()
  @IsNotEmpty()
  resellerId: UUID

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  productIds: UUID[] = []
}
