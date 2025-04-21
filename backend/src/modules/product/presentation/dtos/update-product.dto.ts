import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { IsCurrency, IsEnum, IsOptional, IsString } from 'class-validator'

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @IsCurrency({ allow_negatives: false, require_decimal: true })
  unitCost: Currency

  @IsString()
  @IsOptional()
  @IsCurrency({ allow_negatives: false, require_decimal: true })
  salePrice: Currency

  @IsEnum(ProductStatus)
  @IsOptional()
  status: ProductStatus
}
