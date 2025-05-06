import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { IsCurrency, IsEnum, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
export class UpdateProductDto {
  @ApiProperty({
    description: 'The unit cost of the product',
    example: '100.00',
    type: Currency,
    required: false
  })
  @IsString()
  @IsOptional()
  @IsCurrency({ allow_negatives: false, require_decimal: true })
  unitCost?: string

  @ApiProperty({
    description: 'The sale price of the product',
    example: '100.00',
    type: Currency,
    required: false
  })
  @IsString()
  @IsOptional()
  @IsCurrency({ allow_negatives: false, require_decimal: true })
  salePrice?: string

  @ApiProperty({
    description: 'The status of the product',
    example: ProductStatus.IN_STOCK,
    enumName: 'ProductStatus',
    required: false
  })
  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus
}
