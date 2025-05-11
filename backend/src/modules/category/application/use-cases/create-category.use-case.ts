import { CategoryStatus } from '@/modules/category/domain/enums/category.enum'
import { Category } from '@/modules/category/domain/entities/category.entity'
import { CategoryRepository } from '@/modules/category/domain/repositories/category.repository'
import { CreateCategoryDto } from '@/modules/category/application/dtos/create-category.dto'
import { Injectable, Inject } from '@nestjs/common'
import { CategoryName } from '@/modules/category/domain/value-objects/category-name.vo'
import { Description } from '@/shared/common/value-object/description.vo'

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject('CategoryRepository')
    private readonly CategoryRepository: CategoryRepository
  ) {}

  async execute(input: CreateCategoryDto): Promise<Category> {
    const category = new Category(
      crypto.randomUUID(),
      new CategoryName(input.name),
      input.description ? new Description(input.description) : undefined,
      CategoryStatus.ACTIVE
    )

    return this.CategoryRepository.create(category)
  }
}
