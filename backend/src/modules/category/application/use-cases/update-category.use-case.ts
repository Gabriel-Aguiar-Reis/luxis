import { Category } from '@/modules/category/domain/entities/category.entity'
import { CategoryRepository } from '@/modules/category/domain/repositories/category.repository'
import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { UUID } from 'crypto'
import { UpdateCategoryDto } from '@/modules/category/presentation/dtos/update-category.dto'
import { Description } from '@/shared/common/value-object/description.vo'
import { CategoryName } from '@/modules/category/domain/value-objects/category-name.vo'

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject('CategoryRepository')
    private readonly CategoryRepository: CategoryRepository
  ) {}

  async execute(id: UUID, input: UpdateCategoryDto): Promise<Category> {
    let category = await this.CategoryRepository.findById(id)
    if (!category) {
      throw new NotFoundException('Category not found')
    }

    category = new Category(
      category.id,
      input.name ? new CategoryName(input.name) : category.name,
      input.description
        ? new Description(input.description)
        : category.description,
      category.status
    )

    return this.CategoryRepository.update(category)
  }
}
