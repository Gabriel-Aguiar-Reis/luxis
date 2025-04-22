import { Currency } from '@/shared/common/value-object/currency.vo'
import { IsArray, IsCurrency, IsDate, IsOptional } from 'class-validator'
import { UUID } from 'crypto'

export class UpdateSaleDto {
  @IsArray()
  @IsOptional()
  productIds: UUID[] = []

  @IsDate()
  @IsOptional()
  saleDate: Date

  @IsCurrency()
  @IsOptional()
  totalAmount: Currency
}
