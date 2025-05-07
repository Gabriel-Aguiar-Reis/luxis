import { Category } from '@/modules/category/domain/entities/category.entity'
import { CategoryStatus } from '@/modules/category/domain/enums/category.enum'
import { CategoryRepository } from '@/modules/category/domain/repositories/category.repository'
import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { UUID } from 'crypto'

@Injectable()
export class UpdateStatusCategoryUseCase {
  constructor(
    @Inject('CategoryRepository')
    private readonly CategoryRepository: CategoryRepository
  ) {}

  async execute(id: UUID, status: CategoryStatus): Promise<Category> {
    let category = await this.CategoryRepository.findById(id)
    if (!category) {
      throw new NotFoundException('Category not found')
    }
    return await this.CategoryRepository.updateStatus(id, status)
  }
}
