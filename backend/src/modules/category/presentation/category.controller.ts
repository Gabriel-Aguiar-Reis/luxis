import { CreateCategoryUseCase } from '@/modules/category/application/use-cases/create-category.use-case'
import { CreateCategoryDto } from '@/modules/category/presentation/dtos/create-category.dto'
import { Controller, Post, Body } from '@nestjs/common'

@Controller('categories')
export class CategoriesController {
  constructor(private readonly createCategoryUseCase: CreateCategoryUseCase) {}

  @Post()
  async create(@Body() dto: CreateCategoryDto) {
    return await this.createCategoryUseCase.execute(dto)
  }
}
