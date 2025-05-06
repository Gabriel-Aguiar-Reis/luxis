import { CategoryName } from '@/modules/category/domain/value-objects/category-name.vo'
import { Description } from '@/shared/common/value-object/description.vo'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Category Name',
    type: CategoryName,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: 'The description of the category',
    example: 'Category Description',
    type: Description,
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string
}
