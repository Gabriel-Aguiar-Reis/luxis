import { ModelName } from '@/modules/product-model/domain/value-objects/model-name.vo'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { Description } from '@/shared/common/value-object/description.vo'
import {
  IsCurrency,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID
} from 'class-validator'
import { UUID } from 'crypto'

export class CreateProductModelDto {
  @IsString()
  @IsNotEmpty()
  name: ModelName

  @IsUUID()
  @IsNotEmpty()
  categoryId: UUID

  @IsCurrency()
  @IsNotEmpty()
  suggestedPrice: Currency

  @IsString()
  @IsOptional()
  description?: Description
}
