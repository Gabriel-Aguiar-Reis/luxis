import { SerialNumber } from '@/modules/product/domain/value-objects/serial-number.vo'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { IsCurrency, IsNotEmpty, IsString, IsUUID } from 'class-validator'
import { UUID } from 'crypto'

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  serialNumber: SerialNumber

  @IsUUID()
  @IsNotEmpty()
  modelId: UUID

  @IsUUID()
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
