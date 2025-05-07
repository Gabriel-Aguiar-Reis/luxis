import { Category } from '@/modules/category/domain/entities/category.entity'
import { CategoryStatus } from '@/modules/category/domain/enums/category.enum'
import { UUID } from 'crypto'

export abstract class CategoryRepository {
  abstract findAll(): Promise<Category[]>
  abstract findById(id: UUID): Promise<Category | null>
  abstract create(category: Category): Promise<Category>
  abstract update(category: Category): Promise<Category>
  abstract updateStatus(id: UUID, status: CategoryStatus): Promise<Category>
  abstract delete(id: UUID): Promise<void>
}
