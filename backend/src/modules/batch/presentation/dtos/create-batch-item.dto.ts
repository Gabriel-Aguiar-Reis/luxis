import { Unit } from '@/shared/common/value-object/unit.vo'
import { ModelName } from '@/modules/product-model/domain/value-objects/model-name.vo'
import { Currency } from '@/shared/common/value-object/currency.vo'
import {
  IsCurrency,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min
} from 'class-validator'
import { UUID } from 'crypto'

export class CreateBatchItemDto {
  @IsString()
  @IsNotEmpty()
  modelName: ModelName

  @IsUUID()
  @IsNotEmpty()
  categoryId: UUID

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity: Unit

  @IsOptional()
  @IsCurrency()
  unitCost?: Currency

  @IsOptional()
  @IsCurrency()
  salePrice?: Currency
}
