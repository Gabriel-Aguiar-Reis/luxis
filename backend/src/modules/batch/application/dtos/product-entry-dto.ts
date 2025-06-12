import { ApiProperty } from '@nestjs/swagger'
import {
  IsUUID,
  IsOptional,
  IsPositive,
  IsCurrency,
  IsNotEmpty,
  IsString
} from 'class-validator'
import { UUID } from 'crypto'

export class ProductEntryDto {
  @ApiProperty({
    description: 'The unique identifier of the product model',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    required: false
  })
  @IsUUID()
  @IsOptional()
  modelId?: UUID

  @ApiProperty({
    description: 'The name of the product model',
    example: 'Model Name',
    type: String,
    required: false
  })
  @IsOptional()
  modelName?: string

  @ApiProperty({
    description: 'The unique identifier of the product category',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    required: false
  })
  @IsUUID()
  @IsOptional()
  categoryId?: UUID

  @ApiProperty({
    description: 'The quantity of the product',
    example: 10,
    type: Number,
    required: true
  })
  @IsPositive()
  quantity: number

  @ApiProperty({
    description: 'The unit cost of the product',
    example: '100.00',
    type: String,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @IsCurrency({ allow_negatives: false, require_decimal: true })
  unitCost: string

  @ApiProperty({
    description: 'The sale price of the product',
    example: '120.00',
    type: String,
    required: true
  })
  salePrice: string
  @ApiProperty({
    description: 'The URL of the product image',
    example: 'https://example.com/image.jpg',
    type: String,
    required: false
  })
  photoUrl?: string
}
