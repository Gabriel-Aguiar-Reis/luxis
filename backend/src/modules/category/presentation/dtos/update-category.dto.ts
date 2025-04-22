import { CategoryName } from '@/modules/category/domain/value-objects/category-name.vo'
import { Description } from '@/shared/common/value-object/description.vo'
import { IsOptional, IsString } from 'class-validator'

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  name: CategoryName

  @IsString()
  @IsOptional()
  description: Description
}
