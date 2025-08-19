import { AppModule } from '@/app.module'
import { InventoryService } from '@/modules/inventory/application/services/inventory.service'
import { GetInventoryByIdUseCase } from '@/modules/inventory/application/use-cases/get-inventory-by-id.use-case'
import { InventoryController } from '@/modules/inventory/presentation/inventory.controller'
import { AppConfigService } from '@/shared/config/app-config.service'
import { EventDispatcher } from '@/shared/events/event-dispatcher'
import { CaslAbilityFactory } from '@/shared/infra/auth/casl/casl-ability.factory'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { InventoryTypeOrmEntity } from '@/shared/infra/persistence/typeorm/inventory/inventory.typeorm.entity'
import { InventoryTypeOrmRepository } from '@/shared/infra/persistence/typeorm/inventory/inventory.typeorm.repository'
import { ProductModelTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.entity'
import { ProductModelTypeOrmRepository } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.repository'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { ProductTypeOrmRepository } from '@/shared/infra/persistence/typeorm/product/product.typeorm.repository'
import { UserTypeOrmEntity } from '@/shared/infra/persistence/typeorm/user/user.typeorm.entity'
import { UserTypeOrmRepository } from '@/shared/infra/persistence/typeorm/user/user.typeorm.repository'
import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        InventoryTypeOrmEntity,
        ProductTypeOrmEntity,
        ProductModelTypeOrmEntity,
        UserTypeOrmEntity,
      ]),
    forwardRef(() => AppModule),
  ],
  controllers: [InventoryController],
  providers: [
    EventDispatcher,
    InventoryService,
    CustomLogger,
    AppConfigService,
    GetInventoryByIdUseCase,
    { provide: 'InventoryRepository', useClass: InventoryTypeOrmRepository },
    { provide: 'GetInventoryByIdUseCase', useClass: GetInventoryByIdUseCase },
    { provide: 'ProductRepository', useClass: ProductTypeOrmRepository },
    {
      provide: 'ProductModelRepository',
      useClass: ProductModelTypeOrmRepository
    },
    { provide: 'CaslAbilityFactory', useClass: CaslAbilityFactory },
    { provide: 'UserRepository', useClass: UserTypeOrmRepository }
  ]
})
export class InventoryModule {}
