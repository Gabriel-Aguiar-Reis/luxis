import { CreateCategoryUseCase } from '@/modules/category/application/use-cases/create-category.use-case'
import { DeleteCategoryUseCase } from '@/modules/category/application/use-cases/delete-category.use-case'
import { GetAllCategoryUseCase } from '@/modules/category/application/use-cases/get-all-category.use-case'
import { GetOneCategoryUseCase } from '@/modules/category/application/use-cases/get-one-category.use-case'
import { UpdateCategoryUseCase } from '@/modules/category/application/use-cases/update-category.use-case'
import { CategoryController } from '@/modules/category/presentation/category.controller'
import { CategoryTypeOrmRepository } from '@/shared/infra/persistence/typeorm/category/category.typeorm.repository'
import { Module } from '@nestjs/common'

@Module({
  controllers: [CategoryController],
  providers: [
    CreateCategoryUseCase,
    GetAllCategoryUseCase,
    GetOneCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
    { provide: 'CategoryRepository', useClass: CategoryTypeOrmRepository }
  ]
})
export class CategoryModule {}
