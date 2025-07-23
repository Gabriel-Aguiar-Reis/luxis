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
import { ApiProperty } from '@nestjs/swagger'

export class CreateProductModelDto {
  @ApiProperty({
    description: 'The name of the product model',
    example: 'Product Model Name',
    type: String,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: 'The ID of the category',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    required: true
  })
  @IsUUID()
  @IsNotEmpty()
  categoryId: UUID

  @ApiProperty({
    description: 'The suggested price of the product model',
    example: '100.00',
    type: String,
    required: true
  })
  @IsCurrency()
  @IsNotEmpty()
  suggestedPrice: string

  @ApiProperty({
    description: 'The description of the product model',
    example: 'Product Model Description',
    type: String,
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty({
    description: 'Photo of the product model',
    type: String,
    format: 'binary',
    required: false
  })
  @IsOptional()
  photo?: Express.Multer.File
}
