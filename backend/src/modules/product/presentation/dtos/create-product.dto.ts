import { Currency } from '@/shared/common/value-object/currency.vo'
import { IsCurrency, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { UUID } from 'crypto'

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  serialNumber: string

  @IsString()
  @IsNotEmpty()
  modelId: UUID

  @IsString()
  @IsNotEmpty()
  batchId: UUID

  @IsString()
  @IsNotEmpty()
  @IsCurrency({ allow_negatives: false, require_decimal: true })
  unitCost: Currency

  @IsString()
  @IsNotEmpty()
  @IsCurrency({ allow_negatives: false, require_decimal: true })
  salePrice: Currency
}
