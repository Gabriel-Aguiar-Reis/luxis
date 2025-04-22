import { Category } from '@/modules/category/domain/entities/category.entity'
import { CategoryRepository } from '@/modules/category/domain/repositories/category.repository'
import { Injectable, Inject } from '@nestjs/common'
import { UUID } from 'crypto'
import { UpdateCategoryDto } from '@/modules/category/presentation/dtos/update-category.dto'

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject('CategoryRepository')
    private readonly CategoryRepository: CategoryRepository
  ) {}

  async execute(id: UUID, input: UpdateCategoryDto): Promise<Category> {
    let category = await this.CategoryRepository.findById(id)
    if (!category) {
      throw new Error('Category not found')
    }

    category = new Category(
      category.id,
      input.name ?? category.name,
      input.description ?? category.description,
      category.status
    )

    return this.CategoryRepository.update(category)
  }
}
