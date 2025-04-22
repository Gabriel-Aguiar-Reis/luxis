import { ModelName } from '@/modules/product-model/domain/value-objects/model-name.vo'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { Description } from '@/shared/common/value-object/description.vo'
import { IsCurrency, IsOptional, IsString, IsUUID } from 'class-validator'
import { UUID } from 'crypto'

export class UpdateProductModelDto {
  @IsString()
  @IsOptional()
  name: ModelName

  @IsUUID()
  @IsOptional()
  categoryId: UUID

  @IsCurrency()
  @IsOptional()
  suggestedPrice: Currency

  @IsString()
  @IsOptional()
  description?: Description
}
