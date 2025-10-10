import { CreateShipmentUseCase } from '@/modules/shipment/application/use-cases/create-shipment.use-case'
import { DeleteShipmentUseCase } from '@/modules/shipment/application/use-cases/delete-shipment.use-case'
import { GetAllShipmentUseCase } from '@/modules/shipment/application/use-cases/get-all-shipment.use-case'
import { GetOneShipmentUseCase } from '@/modules/shipment/application/use-cases/get-one-shipment.use-case'
import { UpdateShipmentUseCase } from '@/modules/shipment/application/use-cases/update-shipment.use-case'
import { ShipmentController } from '@/modules/shipment/presentation/shipment.controller'
import { ShipmentTypeOrmRepository } from '@/shared/infra/persistence/typeorm/shipment/shipment.typeorm.repository'
import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ShipmentTypeOrmEntity } from '@/shared/infra/persistence/typeorm/shipment/shipment.typeorm.entity'
import { AppModule } from '@/app.module'
import { CaslAbilityFactory } from '@/shared/infra/auth/casl/casl-ability.factory'
import { UpdateStatusShipmentUseCase } from '@/modules/shipment/application/use-cases/update-status-shipment.use-case'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { AppConfigService } from '@/shared/config/app-config.service'
import { EventDispatcher } from '@/shared/events/event-dispatcher'
import { ProductTypeOrmRepository } from '@/shared/infra/persistence/typeorm/product/product.typeorm.repository'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { ShipmentDispatchedHandler } from '@/modules/inventory/application/handlers/shipment-dispatched.handler'
import { InventoryTypeOrmRepository } from '@/shared/infra/persistence/typeorm/inventory/inventory.typeorm.repository'
import { InventoryService } from '@/modules/inventory/application/services/inventory.service'
import { InventoryTypeOrmEntity } from '@/shared/infra/persistence/typeorm/inventory/inventory.typeorm.entity'
import { ProductModelTypeOrmRepository } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.repository'
import { UserTypeOrmRepository } from '@/shared/infra/persistence/typeorm/user/user.typeorm.repository'
import { ProductModelTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.entity'
import { UserTypeOrmEntity } from '@/shared/infra/persistence/typeorm/user/user.typeorm.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ShipmentTypeOrmEntity,
      ProductTypeOrmEntity,
      InventoryTypeOrmEntity,
      ProductModelTypeOrmEntity,
      UserTypeOrmEntity
    ]),
    forwardRef(() => AppModule)
  ],
  controllers: [ShipmentController],
  providers: [
    CustomLogger,
    AppConfigService,
    EventDispatcher,
    ShipmentDispatchedHandler,
    CreateShipmentUseCase,
    GetAllShipmentUseCase,
    GetOneShipmentUseCase,
    UpdateShipmentUseCase,
    UpdateStatusShipmentUseCase,
    DeleteShipmentUseCase,

    { provide: 'ProductModelRepository', useClass: ProductModelTypeOrmRepository },
    { provide: 'UserRepository', useClass: UserTypeOrmRepository },
    { provide: 'InventoryService', useClass: InventoryService },
    { provide: 'InventoryRepository', useClass: InventoryTypeOrmRepository },
    { provide: 'ShipmentRepository', useClass: ShipmentTypeOrmRepository },
    { provide: 'ProductRepository', useClass: ProductTypeOrmRepository },
    { provide: 'CaslAbilityFactory', useClass: CaslAbilityFactory }
  ]
})
export class ShipmentModule {}
