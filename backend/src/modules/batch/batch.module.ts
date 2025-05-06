import { forwardRef, Module } from '@nestjs/common'
import { BatchController } from '@/modules/batch/presentation/batch.controller'
import { CreateBatchUseCase } from '@/modules/batch/application/use-cases/create-batch.use-case'
import { DeleteBatchUseCase } from '@/modules/batch/application/use-cases/delete-batch.use-case'
import { GetAllBatchUseCase } from '@/modules/batch/application/use-cases/get-all-batch.use-case'
import { GetOneBatchUseCase } from '@/modules/batch/application/use-cases/get-one-batch.use-case'
import { BatchTypeOrmRepository } from '@/shared/infra/persistence/typeorm/batch/batch.typeorm.repository'
import { GetBatchQtyByMonthUseCase } from '@/modules/batch/application/use-cases/get-batch-qty-by-month.use-case'
import { BatchItemResolver } from '@/modules/batch/application/services/batch-item-resolver.service'
import { ProductTypeOrmRepository } from '@/shared/infra/persistence/typeorm/product/product.typeorm.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BatchTypeOrmEntity } from '@/shared/infra/persistence/typeorm/batch/batch.typeorm.entity'
import { CategoryTypeOrmRepository } from '@/shared/infra/persistence/typeorm/category/category.typeorm.repository'
import { ProductModelTypeOrmRepository } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.repository'
import { CategoryTypeOrmEntity } from '@/shared/infra/persistence/typeorm/category/category.typeorm.entity'
import { ProductModelTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.entity'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { AppModule } from '@/app.module'
import { CaslAbilityFactory } from '@/shared/infra/auth/casl/casl-ability.factory'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { AppConfigService } from '@/shared/config/app-config.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BatchTypeOrmEntity,
      ProductTypeOrmEntity,
      CategoryTypeOrmEntity,
      ProductModelTypeOrmEntity
    ]),
    forwardRef(() => AppModule)
  ],
  controllers: [BatchController],
  providers: [
    CustomLogger,
    AppConfigService,
    CreateBatchUseCase,
    GetAllBatchUseCase,
    GetBatchQtyByMonthUseCase,
    GetOneBatchUseCase,
    DeleteBatchUseCase,
    { provide: 'BatchRepository', useClass: BatchTypeOrmRepository },
    { provide: 'BatchItemResolver', useClass: BatchItemResolver },
    { provide: 'ProductRepository', useClass: ProductTypeOrmRepository },
    { provide: 'CategoryRepository', useClass: CategoryTypeOrmRepository },
    {
      provide: 'ProductModelRepository',
      useClass: ProductModelTypeOrmRepository
    },
    { provide: 'CaslAbilityFactory', useClass: CaslAbilityFactory }
  ]
})
export class BatchModule {}
