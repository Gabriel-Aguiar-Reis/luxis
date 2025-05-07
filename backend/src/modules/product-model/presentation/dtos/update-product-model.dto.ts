import { ModelName } from '@/modules/product-model/domain/value-objects/model-name.vo'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { Description } from '@/shared/common/value-object/description.vo'
import { IsCurrency, IsOptional, IsString, IsUUID } from 'class-validator'
import { UUID } from 'crypto'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateProductModelDto {
  @ApiProperty({
    description: 'The name of the product model',
    example: 'Product Model Name',
    type: ModelName,
    required: false
  })
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty({
    description: 'The ID of the category',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    required: false
  })
  @IsUUID()
  @IsOptional()
  categoryId?: UUID

  @ApiProperty({
    description: 'The suggested price of the product model',
    example: '100.00',
    type: Currency,
    required: false
  })
  @IsCurrency()
  @IsOptional()
  suggestedPrice?: string

  @ApiProperty({
    description: 'The description of the product model',
    example: 'Product Model Description',
    type: Description,
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty({
    description: 'The photo of the product model',
    type: String,
    format: 'binary',
    required: false
  })
  @IsOptional()
  photo?: Express.Multer.File
}
