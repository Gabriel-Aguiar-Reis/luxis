import { IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Category Name',
    type: String,
    required: false
  })
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty({
    description: 'The description of the category',
    example: 'Category Description',
    type: String,
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string
}
