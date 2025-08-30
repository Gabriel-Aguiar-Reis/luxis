import { CreateReturnUseCase } from '@/modules/return/application/use-cases/create-return.use-case'
import { DeleteReturnUseCase } from '@/modules/return/application/use-cases/delete-return.use-case'
import { GetAllReturnUseCase } from '@/modules/return/application/use-cases/get-all-return.use-case'
import { GetOneReturnUseCase } from '@/modules/return/application/use-cases/get-one-return.use-case'
import { UpdateReturnUseCase } from '@/modules/return/application/use-cases/update-return.use-case'
import { UpdateReturnStatusUseCase } from '@/modules/return/application/use-cases/update-return-status.use-case'
import { ReturnController } from '@/modules/return/presentation/return.controller'
import { ReturnTypeOrmRepository } from '@/shared/infra/persistence/typeorm/return/return.typeorm.repository'
import { Module, forwardRef } from '@nestjs/common'
import { ReturnConfirmedHandler } from '@/modules/inventory/application/handlers/return-confirmed.handler'
import { EventDispatcher } from '@/shared/events/event-dispatcher'
import { InventoryService } from '@/modules/inventory/application/services/inventory.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ReturnTypeOrmEntity } from '@/shared/infra/persistence/typeorm/return/return.typeorm.entity'
import { AppConfigService } from '@/shared/config/app-config.service'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { InventoryTypeOrmRepository } from '@/shared/infra/persistence/typeorm/inventory/inventory.typeorm.repository'
import { InventoryTypeOrmEntity } from '@/shared/infra/persistence/typeorm/inventory/inventory.typeorm.entity'
import { AppModule } from '@/app.module'
import { CaslAbilityFactory } from '@/shared/infra/auth/casl/casl-ability.factory'
import { GetReturnsByResellerIdUseCase } from '@/modules/return/application/use-cases/get-returns-by-reseller-id.use-case'
import { UserTypeOrmEntity } from '@/shared/infra/persistence/typeorm/user/user.typeorm.entity'
import { UserTypeOrmRepository } from '@/shared/infra/persistence/typeorm/user/user.typeorm.repository'
import { ProductTypeOrmRepository } from '@/shared/infra/persistence/typeorm/product/product.typeorm.repository'
import { ProductModelTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.entity'
import { ProductModelTypeOrmRepository } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.repository'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        ReturnTypeOrmEntity,
        InventoryTypeOrmEntity,
        UserTypeOrmEntity,
        ProductTypeOrmEntity,
        ProductModelTypeOrmEntity
      ]),
    forwardRef(() => AppModule)
  ],
  controllers: [ReturnController],
  providers: [
    CustomLogger,
    AppConfigService,
    CreateReturnUseCase,
    GetAllReturnUseCase,
    GetOneReturnUseCase,
    UpdateReturnUseCase,
    DeleteReturnUseCase,
    UpdateReturnStatusUseCase,
    GetReturnsByResellerIdUseCase,
    ReturnConfirmedHandler,
    EventDispatcher,
    { provide: 'ReturnRepository', useClass: ReturnTypeOrmRepository },
    { provide: 'InventoryService', useClass: InventoryService },
    { provide: 'InventoryRepository', useClass: InventoryTypeOrmRepository },
    { provide: 'CaslAbilityFactory', useClass: CaslAbilityFactory },
    { provide: 'UserRepository', useClass: UserTypeOrmRepository },
    { provide: 'ProductRepository', useClass: ProductTypeOrmRepository },
    { provide: 'ProductModelRepository', useClass: ProductModelTypeOrmRepository }
  ]
})
export class ReturnModule {}
