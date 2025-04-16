import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
import { IsCurrency, IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  serialNumber: string

  @IsString()
  @IsNotEmpty()
  modelId: string

  @IsString()
  @IsNotEmpty()
  batchId: string

  @IsString()
  @IsNotEmpty()
  @IsCurrency({ allow_negatives: false, require_decimal: true })
  unitCost: string

  @IsString()
  @IsNotEmpty()
  @IsCurrency({ allow_negatives: false, require_decimal: true })
  salePrice: string

  @IsString()
  @IsNotEmpty()
  @IsEnum(ProductStatus)
  status: ProductStatus
}
