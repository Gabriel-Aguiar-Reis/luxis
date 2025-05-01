import { ArrayNotEmpty, IsArray, IsDate, IsNotEmpty } from 'class-validator'
import { UUID } from 'crypto'

export class CreateSaleDto {
  @IsArray()
  @ArrayNotEmpty()
  productIds: UUID[] = []

  @IsDate()
  @IsNotEmpty()
  saleDate: Date
}
