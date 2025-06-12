import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Category Name',
    type: String,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  name: string

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
