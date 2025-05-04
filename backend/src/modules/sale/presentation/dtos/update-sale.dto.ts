import { ArrayNotEmpty, IsArray } from 'class-validator'
import { UUID } from 'crypto'

export class UpdateSaleDto {
  @IsArray()
  @ArrayNotEmpty()
  productIds: UUID[]
}
