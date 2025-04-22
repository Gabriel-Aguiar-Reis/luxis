import { Currency } from '@/shared/common/value-object/currency.vo'
import {
  ArrayNotEmpty,
  IsArray,
  IsCurrency,
  IsDate,
  IsNotEmpty,
  IsUUID
} from 'class-validator'
import { UUID } from 'crypto'

export class CreateSaleDto {
  @IsUUID()
  @IsNotEmpty()
  resellerId: UUID

  @IsArray()
  @ArrayNotEmpty()
  productIds: UUID[] = []

  @IsDate()
  @IsNotEmpty()
  saleDate: Date

  @IsCurrency()
  @IsNotEmpty()
  totalAmount: Currency
}
