import { CategoryRepository } from '@/modules/category/domain/repositories/category.repository'
import { Injectable, Inject } from '@nestjs/common'
import { UUID } from 'crypto'

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    @Inject('CategoryRepository')
    private readonly CategoryRepository: CategoryRepository
  ) {}

  async execute(id: UUID): Promise<void> {
    let category = await this.CategoryRepository.findById(id)
    if (!category) {
      throw new Error('Category not found')
    }

    return this.CategoryRepository.delete(id)
  }
}
