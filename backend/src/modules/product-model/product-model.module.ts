import { CreateProductModelUseCase } from '@/modules/product-model/application/use-cases/create-product-model.use-case'
import { DeleteProductModelUseCase } from '@/modules/product-model/application/use-cases/delete-product-model.use-case'
import { GetAllProductModelUseCase } from '@/modules/product-model/application/use-cases/get-all/get-all-product-model.use-case'
import { GetOneProductModelUseCase } from '@/modules/product-model/application/use-cases/get-one-product-model.use-case'
import { UpdateProductModelUseCase } from '@/modules/product-model/application/use-cases/update-product-model.use-case'
import { ProductModelController } from '@/modules/product-model/presentation/product-model.controller'
import { ProductModelTypeOrmRepository } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductModelTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.entity'
import { CloudinaryModule } from '@/shared/infra/cloudinary/cloudinary.module'
import { CloudinaryService } from '@/shared/infra/cloudinary/cloudinary.service'
import { GetAllProductModelStrategyFactory } from '@/modules/product-model/application/use-cases/get-all/strategies/get-all-product-model.strategy.factory'
import { GetAllProductModelAdminStrategy } from '@/modules/product-model/application/use-cases/get-all/strategies/get-all-product-model-admin.strategy'
import { GetAllProductModelResellerStrategy } from '@/modules/product-model/application/use-cases/get-all/strategies/get-all-product-model-reseller.strategy'
import { GetAllProductModelAssistantStrategy } from '@/modules/product-model/application/use-cases/get-all/strategies/get-all-product-model-assistant.strategy'
import { AppConfigService } from '@/shared/config/app-config.service'
import { AppModule } from '@/app.module'
import { forwardRef, Module } from '@nestjs/common'
import { CaslAbilityFactory } from '@/shared/infra/auth/casl/casl-ability.factory'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
@Module({
  imports: [
    TypeOrmModule.forFeature([ProductModelTypeOrmEntity]),
    forwardRef(() => AppModule),
    CloudinaryModule
  ],
  controllers: [ProductModelController],
  providers: [
    CustomLogger,
    AppConfigService,
    CreateProductModelUseCase,
    GetAllProductModelUseCase,
    GetOneProductModelUseCase,
    UpdateProductModelUseCase,
    DeleteProductModelUseCase,
    GetAllProductModelStrategyFactory,
    GetAllProductModelAdminStrategy,
    GetAllProductModelResellerStrategy,
    GetAllProductModelAssistantStrategy,
    {
      provide: 'ProductModelRepository',
      useClass: ProductModelTypeOrmRepository
    },
    {
      provide: 'CloudinaryService',
      useClass: CloudinaryService
    },
    { provide: 'CaslAbilityFactory', useClass: CaslAbilityFactory }
  ]
})
export class ProductModelModule {}
