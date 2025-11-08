import { CategoryName } from '@/modules/category/domain/value-objects/category-name.vo'
import { ModelName } from '@/modules/product-model/domain/value-objects/model-name.vo'
import { SerialNumber } from '@/modules/product/domain/value-objects/serial-number.vo'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { ApiProperty } from '@nestjs/swagger'
import { IsUUID, IsNotEmpty } from 'class-validator'
import { UUID } from 'crypto'

export class GetSaleProductDto {
  @ApiProperty({
    description: 'The ID of the sale product',
    example: '123e4567-e89b-12d3-a456-426614174003',
    type: String,
    required: true
  })
  @IsUUID()
  @IsNotEmpty()
  id: UUID

  @ApiProperty({
    description: 'The serial number of the product',
    example: 'SN123456789',
    type: SerialNumber,
    required: true
  })
  @IsNotEmpty()
  serialNumber: SerialNumber

  @ApiProperty({
    description: 'The sale price of the product',
    example: '500.00',
    type: Currency,
    required: true
  })
  @IsNotEmpty()
  salePrice: Currency

  @ApiProperty({
    description: 'The name of the product model',
    example: 'iPhone 13 Pro Max',
    type: ModelName,
    required: true
  })
  @IsNotEmpty()
  modelName: ModelName

  @ApiProperty({
    description: 'The name of the category',
    example: 'Smartphones',
    type: CategoryName,
    required: true
  })
  @IsNotEmpty()
  categoryName: CategoryName

  @ApiProperty({
    description: 'The ID of the product model',
    example: '123e4567-e89b-12d3-a456-426614174002',
    type: String,
    required: true
  })
  @IsUUID()
  @IsNotEmpty()
  modelId: UUID

  @ApiProperty({
    description: 'The ID of the category',
    example: '123e4567-e89b-12d3-a456-426614174001',
    type: String,
    required: true
  })
  @IsUUID()
  @IsNotEmpty()
  categoryId: UUID
}
