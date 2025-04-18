import { Unit } from '@/modules/batch/domain/value-objects/unit.vo'
import { ModelName } from '@/modules/product-model/domain/value-objects/model-name.vo'
import { Currency } from '@/shared/common/value-object/currency.vo'
import {
  IsCurrency,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID
} from 'class-validator'
import { UUID } from 'crypto'

export class CreateBatchItemDto {
  @IsString()
  @IsNotEmpty()
  modelName: ModelName

  @IsUUID()
  @IsNotEmpty()
  categoryId: UUID

  @IsNumber({ maxDecimalPlaces: 0 })
  @IsNotEmpty()
  quantity: Unit

  @IsOptional()
  @IsCurrency()
  unitCost?: Currency

  @IsOptional()
  @IsCurrency()
  salePrice?: Currency
}
