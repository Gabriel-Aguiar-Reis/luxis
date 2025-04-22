import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID
} from 'class-validator'
import { UUID } from 'crypto'

export class CreatePackingListDto {
  @IsUUID()
  @IsNotEmpty()
  resellerId: UUID

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  productIds: UUID[] = []
}
