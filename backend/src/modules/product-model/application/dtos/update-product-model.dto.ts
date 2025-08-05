import {
  IsCurrency,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID
} from 'class-validator'
import { UUID } from 'crypto'
import { ApiProperty } from '@nestjs/swagger'
import { ProductModelStatus } from '@/modules/product-model/domain/enums/product-model-status.enum'

export class UpdateProductModelDto {
  @ApiProperty({
    description: 'The name of the product model',
    example: 'Product Model Name',
    type: String,
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
    type: String,
    required: false
  })
  @IsCurrency()
  @IsOptional()
  suggestedPrice?: string

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
    description: 'The photo of the product model',
    type: String,
    format: 'binary',
    required: false
  })
  @IsOptional()
  photo?: Express.Multer.File

  @ApiProperty({
    description: 'The photo URL of the product model',
    example: 'https://example.com/photo.jpg',
    type: String,
    required: false
  })
  @IsUrl()
  @IsOptional()
  photoUrl?: string

  @ApiProperty({
    description: 'The status of the product model',
    enum: ProductModelStatus,
    example: ProductModelStatus.ACTIVE,
    required: false
  })
  @IsEnum(ProductModelStatus)
  @IsOptional()
  status?: ProductModelStatus
}
