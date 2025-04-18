import { Category } from '@/modules/category/domain/entities/category.entity'
import { UUID } from 'crypto'

export abstract class CategoryRepository {
  abstract findAll(): Promise<Category[]>
  abstract findById(id: UUID): Promise<Category | null>
  abstract create(category: Category): Promise<Category>
  abstract update(category: Category): Promise<Category>
  abstract delete(id: UUID): Promise<void>
}
