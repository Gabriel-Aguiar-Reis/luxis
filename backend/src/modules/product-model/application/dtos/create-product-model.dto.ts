import {
  IsCurrency,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl
} from 'class-validator'
import { UploadedFile } from '@/shared/types/uploaded-file'
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
  // Accept either a base64 string / remote URL or an uploaded file object (fallback)
  photo?: string | UploadedFile

  @ApiProperty({
    description: 'The photo URL of the product model (direct upload)',
    example: 'https://res.cloudinary.com/.../image.jpg',
    type: String,
    required: false
  })
  @IsUrl()
  @IsOptional()
  photoUrl?: string
}
