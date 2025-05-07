import { Category } from '@/modules/category/domain/entities/category.entity'
import { CategoryTypeOrmEntity } from '@/shared/infra/persistence/typeorm/category/category.typeorm.entity'
import { CategoryName } from '@/modules/category/domain/value-objects/category-name.vo'
import { Description } from '@/shared/common/value-object/description.vo'

export class CategoryMapper {
  static toDomain(entity: CategoryTypeOrmEntity): Category {
    return new Category(
      entity.id,
      new CategoryName(entity.name),
      entity.description ? new Description(entity.description) : undefined,
      entity.status
    )
  }

  static toTypeOrm(category: Category): CategoryTypeOrmEntity {
    const entity = new CategoryTypeOrmEntity()
    entity.id = category.id
    entity.name = category.name.getValue()
    entity.description = category.description?.getValue() ?? ''
    entity.status = category.status
    return entity
  }

  static toPersistence(category: Category): any {
    return {
      id: category.id,
      name: category.name.getValue(),
      description: category.description?.getValue(),
      status: category.status
    }
  }

  static toResponse(category: Category): any {
    return {
      id: category.id,
      name: category.name.getValue(),
      description: category.description?.getValue(),
      status: category.status
    }
  }
}
