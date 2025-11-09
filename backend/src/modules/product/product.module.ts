import { InventoryService } from '@/modules/inventory/application/services/inventory.service'
import { CreateProductUseCase } from '@/modules/product/application/use-cases/create-product.use-case'
import { DeleteProductUseCase } from '@/modules/product/application/use-cases/delete-product.use-case'
import { GetAllProductUseCase } from '@/modules/product/application/use-cases/get-all-product.use-case'
import { GetOneProductUseCase } from '@/modules/product/application/use-cases/get-one-product.use-case'
import { UpdateProductUseCase } from '@/modules/product/application/use-cases/update-product.use-case'
import { GetAvailableProductsUseCase } from '@/modules/product/application/use-cases/get-available-products.use-case'
import { ProductController } from '@/modules/product/presentation/product.controller'
import { ProductTypeOrmRepository } from '@/shared/infra/persistence/typeorm/product/product.typeorm.repository'
import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { InventoryTypeOrmRepository } from '@/shared/infra/persistence/typeorm/inventory/inventory.typeorm.repository'
import { InventoryTypeOrmEntity } from '@/shared/infra/persistence/typeorm/inventory/inventory.typeorm.entity'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { AppConfigService } from '@/shared/config/app-config.service'
import { AppModule } from '@/app.module'
import { CaslAbilityFactory } from '@/shared/infra/auth/casl/casl-ability.factory'
import { SellProductUseCase } from '@/modules/product/application/use-cases/sell-product.use-case'

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductTypeOrmEntity, InventoryTypeOrmEntity]),
    forwardRef(() => AppModule)
  ],
  controllers: [ProductController],
  providers: [
    AppConfigService,
    CustomLogger,
    CreateProductUseCase,
    GetOneProductUseCase,
    GetAllProductUseCase,
    GetAvailableProductsUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    SellProductUseCase,
    { provide: 'ProductRepository', useClass: ProductTypeOrmRepository },
    { provide: 'InventoryRepository', useClass: InventoryTypeOrmRepository },
    { provide: 'InventoryService', useClass: InventoryService },
    { provide: 'CaslAbilityFactory', useClass: CaslAbilityFactory }
  ]
})
export class ProductModule {}
