import { ApiProperty } from '@nestjs/swagger'
import { IsUUID, IsNotEmpty, IsString } from 'class-validator'
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
    type: String,
    required: true
  })
  @IsNotEmpty()
  @IsString()
  serialNumber: string

  @ApiProperty({
    description: 'The sale price of the product',
    example: '500.00',
    type: String,
    required: true
  })
  @IsNotEmpty()
  @IsString()
  salePrice: string

  @ApiProperty({
    description: 'The name of the product model',
    example: 'iPhone 13 Pro Max',
    type: String,
    required: true
  })
  @IsNotEmpty()
  @IsString()
  modelName: string

  @ApiProperty({
    description: 'The name of the category',
    example: 'Smartphones',
    type: String,
    required: true
  })
  @IsNotEmpty()
  @IsString()
  categoryName: string

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
