import { SerialNumber } from '@/modules/product/domain/value-objects/serial-number.vo'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { IsCurrency, IsNotEmpty, IsString, IsUUID } from 'class-validator'
import { UUID } from 'crypto'
import { ApiProperty } from '@nestjs/swagger'

export class CreateProductDto {
  @ApiProperty({
    description: 'The serial number of the product',
    example: '1234567890',
    type: SerialNumber,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  serialNumber: SerialNumber

  @ApiProperty({
    description: 'The ID of the product model',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    required: true
  })
  @IsUUID()
  @IsNotEmpty()
  modelId: UUID

  @ApiProperty({
    description: 'The ID of the batch',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    required: true
  })
  @IsUUID()
  @IsNotEmpty()
  batchId: UUID

  @ApiProperty({
    description: 'The unit cost of the product',
    example: '100.00',
    type: Currency,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @IsCurrency({ allow_negatives: false, require_decimal: true })
  unitCost: Currency

  @ApiProperty({
    description: 'The sale price of the product',
    example: '100.00',
    type: Currency,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @IsCurrency({ allow_negatives: false, require_decimal: true })
  salePrice: Currency
}
