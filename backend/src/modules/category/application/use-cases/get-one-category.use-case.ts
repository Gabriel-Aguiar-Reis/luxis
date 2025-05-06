import { Category } from '@/modules/category/domain/entities/category.entity'
import { CategoryRepository } from '@/modules/category/domain/repositories/category.repository'
import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { UUID } from 'crypto'

@Injectable()
export class GetOneCategoryUseCase {
  constructor(
    @Inject('CategoryRepository')
    private readonly CategoryRepository: CategoryRepository
  ) {}

  async execute(id: UUID): Promise<Category> {
    let category = await this.CategoryRepository.findById(id)
    if (!category) {
      throw new NotFoundException('Category not found')
    }
    return category
  }
}
