import { CategoryName } from '@/modules/category/domain/value-objects/category-name.vo'
import { Description } from '@/shared/common/value-object/description.vo'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: CategoryName

  @IsString()
  @IsNotEmpty()
  description: Description
}
