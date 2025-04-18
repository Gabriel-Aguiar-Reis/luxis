import { CategoryStatus } from '@/modules/category/domain/enums/category.enum'
import { Category } from '@/modules/category/domain/entities/category.entity'
import { CategoryRepository } from '@/modules/category/domain/repositories/category.repository'
import { CreateCategoryDto } from '@/modules/category/presentation/dtos/create-category.dto'
import { Injectable, Inject } from '@nestjs/common'

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject('CategoryRepository')
    private readonly CategoryRepository: CategoryRepository
  ) {}

  async execute(input: CreateCategoryDto): Promise<Category> {
    const category = new Category(
      crypto.randomUUID(),
      input.name,
      input.description,
      CategoryStatus.ACTIVE
    )

    return this.CategoryRepository.create(category)
  }
}
