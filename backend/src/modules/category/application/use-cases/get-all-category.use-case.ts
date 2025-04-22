import { Category } from '@/modules/category/domain/entities/category.entity'
import { CategoryRepository } from '@/modules/category/domain/repositories/category.repository'
import { Injectable, Inject } from '@nestjs/common'

@Injectable()
export class GetAllCategoryUseCase {
  constructor(
    @Inject('CategoryRepository')
    private readonly CategoryRepository: CategoryRepository
  ) {}

  async execute(): Promise<Category[]> {
    return await this.CategoryRepository.findAll()
  }
}
