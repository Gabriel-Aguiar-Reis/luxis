import { CategoryName } from '@/modules/category/domain/value-objects/category-name.vo'
import { Description } from '@/shared/common/value-object/description.vo'
import { IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Category Name',
    type: CategoryName,
    required: false
  })
  @IsString()
  @IsOptional()
  name?: CategoryName

  @ApiProperty({
    description: 'The description of the category',
    example: 'Category Description',
    type: Description,
    required: false
  })
  @IsString()
  @IsOptional()
  description?: Description
}
