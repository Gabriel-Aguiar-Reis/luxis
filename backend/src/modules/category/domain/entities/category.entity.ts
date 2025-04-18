import { CategoryStatus } from '@/modules/category/domain/enums/category.enum'
import { CategoryName } from '@/modules/category/domain/value-objects/category-name.vo'
import { Description } from '@/shared/common/value-object/description.vo'
import { UUID } from 'crypto'

export class Category {
  constructor(
    public readonly id: UUID,
    public name: CategoryName,
    public description?: Description,
    public status: CategoryStatus = CategoryStatus.ACTIVE
  ) {}
}
