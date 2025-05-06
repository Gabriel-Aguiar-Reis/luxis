import { CreateCategoryUseCase } from '@/modules/category/application/use-cases/create-category.use-case'
import { DeleteCategoryUseCase } from '@/modules/category/application/use-cases/delete-category.use-case'
import { GetAllCategoryUseCase } from '@/modules/category/application/use-cases/get-all-category.use-case'
import { GetOneCategoryUseCase } from '@/modules/category/application/use-cases/get-one-category.use-case'
import { UpdateCategoryUseCase } from '@/modules/category/application/use-cases/update-category.use-case'
import { CategoryController } from '@/modules/category/presentation/category.controller'
import { CaslAbilityFactory } from '@/shared/infra/auth/casl/casl-ability.factory'
import { CategoryTypeOrmEntity } from '@/shared/infra/persistence/typeorm/category/category.typeorm.entity'
import { CategoryTypeOrmRepository } from '@/shared/infra/persistence/typeorm/category/category.typeorm.repository'
import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppModule } from '@/app.module'
import { UpdateStatusCategoryUseCase } from '@/modules/category/application/use-cases/update-status-category.use-case'
import { AppConfigService } from '@/shared/config/app-config.service'
import { CustomLogger } from '@/shared/infra/logging/logger.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryTypeOrmEntity]),
    forwardRef(() => AppModule)
  ],
  controllers: [CategoryController],
  providers: [
    CustomLogger,
    AppConfigService,
    CreateCategoryUseCase,
    GetAllCategoryUseCase,
    GetOneCategoryUseCase,
    UpdateCategoryUseCase,
    UpdateStatusCategoryUseCase,
    DeleteCategoryUseCase,
    { provide: 'CategoryRepository', useClass: CategoryTypeOrmRepository },
    { provide: 'CaslAbilityFactory', useClass: CaslAbilityFactory }
  ]
})
export class CategoryModule {}
