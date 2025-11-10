import { ModelName } from '@/modules/product-model/domain/value-objects/model-name.vo'
import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
import { SerialNumber } from '@/modules/product/domain/value-objects/serial-number.vo'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator'
import { UUID } from 'crypto'

export class UserProductDto {
  @ApiProperty({
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  @IsNotEmpty()
  id: UUID

  @ApiProperty({
    description: 'Product serial number',
    example: 'SN123456',
    type: SerialNumber
  })
  @IsNotEmpty()
  serialNumber: SerialNumber

  @ApiProperty({
    description: 'Product model name',
    example: 'Bolsa Louis Vuitton',
    type: ModelName
  })
  @IsNotEmpty()
  modelName: ModelName

  @ApiProperty({
    description: 'Product model ID',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsUUID()
  @IsNotEmpty()
  modelId: UUID

  @ApiProperty({
    description: 'Product status',
    example: ProductStatus.IN_STOCK,
    enum: ProductStatus
  })
  @IsNotEmpty()
  @IsEnum(ProductStatus)
  status: ProductStatus

  @ApiProperty({
    description: 'Product price',
    example: '1500.00',
    type: Currency
  })
  @IsNotEmpty()
  salePrice: Currency
}
