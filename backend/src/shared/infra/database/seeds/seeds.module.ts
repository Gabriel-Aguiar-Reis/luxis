import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SuperuserSeed } from '@/shared/infra/database/seeds/superuser.seed'
import { UserTypeOrmEntity } from '@/shared/infra/persistence/typeorm/user/user.typeorm.entity'
import { AppConfigService } from '@/shared/config/app-config.service'
import { ConfigModule } from '@/shared/config/config.module'
import { SupplierSeed } from '@/shared/infra/database/seeds/supplier.seed'
import { BatchSeed } from '@/shared/infra/database/seeds/batch.seed'
import { CustomerSeed } from '@/shared/infra/database/seeds/customer.seed'
import { SaleSeed } from '@/shared/infra/database/seeds/sale.seed'
import { ReturnSeed } from '@/shared/infra/database/seeds/return.seed'
import { OwnershipTransferSeed } from '@/shared/infra/database/seeds/ownership-transfer.seed'
import { ShipmentSeed } from '@/shared/infra/database/seeds/shipment.seed'
import { ResellerSeed } from '@/shared/infra/database/seeds/reseller.seed'
import { CloudinaryService } from '@/shared/infra/cloudinary/cloudinary.service'
import { CreateBatchUseCase } from '@/modules/batch/application/use-cases/create-batch.use-case'
import { GetBatchQtyByMonthUseCase } from '@/modules/batch/application/use-cases/get-batch-qty-by-month.use-case'
import { CategoryTypeOrmEntity } from '@/shared/infra/persistence/typeorm/category/category.typeorm.entity'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { ProductModelTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.entity'
import { SupplierTypeOrmEntity } from '@/shared/infra/persistence/typeorm/supplier/supplier.typeorm.entity'
import { BatchTypeOrmEntity } from '@/shared/infra/persistence/typeorm/batch/batch.typeorm.entity'
import { CustomerTypeOrmEntity } from '@/shared/infra/persistence/typeorm/customer/customer.typeorm.entity'
import { OwnershipTransferTypeOrmEntity } from '@/shared/infra/persistence/typeorm/ownership-transfer/ownership-transfer.typeorm.entity'
import { ReturnTypeOrmEntity } from '@/shared/infra/persistence/typeorm/return/return.typeorm.entity'
import { SaleTypeOrmEntity } from '@/shared/infra/persistence/typeorm/sale/sale.typeorm.entity'
import { ShipmentTypeOrmEntity } from '@/shared/infra/persistence/typeorm/shipment/shipment.typeorm.entity'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { AppModule } from '@/app.module'
import { CreateCustomerUseCase } from '@/modules/customer/application/use-cases/create-customer.use-case'
import { CreateOwnershipTransferUseCase } from '@/modules/ownership-transfer/application/use-cases/create-ownership-transfer.use-case'
import { CreateReturnUseCase } from '@/modules/return/application/use-cases/create-return.use-case'
import { CreateUserUseCase } from '@/modules/user/application/use-cases/create-user.use-case'
import { CreateSaleUseCase } from '@/modules/sale/application/use-cases/create/create-sale.use-case'
import { CreateShipmentUseCase } from '@/modules/shipment/application/use-cases/create-shipment.use-case'
import { CreateSupplierUseCase } from '@/modules/supplier/application/use-cases/create-supplier.use-case'
import { UserTypeOrmRepository } from '@/shared/infra/persistence/typeorm/user/user.typeorm.repository'
import { CreateCategoryUseCase } from '@/modules/category/application/use-cases/create-category.use-case'
import { BatchTypeOrmRepository } from '@/shared/infra/persistence/typeorm/batch/batch.typeorm.repository'
import { ProductTypeOrmRepository } from '@/shared/infra/persistence/typeorm/product/product.typeorm.repository'
import { CategoryTypeOrmRepository } from '@/shared/infra/persistence/typeorm/category/category.typeorm.repository'
import { CustomerPortfolioService } from '@/modules/customer-portfolio/application/services/customer-portfolio.service'
import { EventDispatcher } from '@/shared/events/event-dispatcher'
import { OwnershipTransferTypeOrmRepository } from '@/shared/infra/persistence/typeorm/ownership-transfer/ownership-transfer.typeorm.repository'
import { ReturnTypeOrmRepository } from '@/shared/infra/persistence/typeorm/return/return.typeorm.repository'
import { SaleTypeOrmRepository } from '@/shared/infra/persistence/typeorm/sale/sale.typeorm.repository'
import { ShipmentTypeOrmRepository } from '@/shared/infra/persistence/typeorm/shipment/shipment.typeorm.repository'
import { SupplierTypeOrmRepository } from '@/shared/infra/persistence/typeorm/supplier/supplier.typeorm.repository'
import { CreateSaleStrategyFactory } from '@/modules/sale/application/use-cases/create/strategies/create-sale.strategy.factory'
import { CreateSaleAdminStrategy } from '@/modules/sale/application/use-cases/create/strategies/create-sale-admin.strategy'
import { CreateSaleResellerStrategy } from '@/modules/sale/application/use-cases/create/strategies/create-sale-reseller.strategy'
import { SalePriceCalculatorService } from '@/modules/sale/application/services/sale-price-calculator.service'
import { InventoryOwnershipVerifierService } from '@/modules/sale/application/services/inventory-ownership-verify.service'
import { ProductModelTypeOrmRepository } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.repository'
import { CustomerPortfolioTypeOrmRepository } from '@/shared/infra/persistence/typeorm/customer-portfolio/customer-portfolio.typeorm.repository'
import { CustomerPortfolioTypeOrmEntity } from '@/shared/infra/persistence/typeorm/customer-portfolio/customer-portfolio.typeorm.entity'
import { InventoryService } from '@/modules/inventory/application/services/inventory.service'
import { InventoryTypeOrmRepository } from '@/shared/infra/persistence/typeorm/inventory/inventory.typeorm.repository'
import { InventoryTypeOrmEntity } from '@/shared/infra/persistence/typeorm/inventory/inventory.typeorm.entity'
import { UpdateProductModelUseCase } from '@/modules/product-model/application/use-cases/update-product-model.use-case'
import { CustomerTypeOrmRepository } from '@/shared/infra/persistence/typeorm/customer/customer.typeorm.repository'
import { UpdateUserRoleUseCase } from '@/modules/user/application/use-cases/update-user-role.use-case'
import { UpdateStatusShipmentUseCase } from '@/modules/shipment/application/use-cases/update-status-shipment.use-case'
import { UpdateReturnStatusUseCase } from '@/modules/return/application/use-cases/update-return-status.use-case'
import { UpdateStatusOwnershipTransferUseCase } from '@/modules/ownership-transfer/application/use-cases/update-status-ownership-transfer.use-case'
import { ProductEntryResolver } from '@/modules/batch/application/services/product-entry-resolver.service'
import { ShipmentDispatchedHandler } from '@/modules/inventory/application/handlers/shipment-dispatched.handler'
import { CustomerCreatedHandler } from '@/modules/customer-portfolio/application/handlers/customer-created.handler'
import { OwnershipTransferDispatchedHandler } from '@/modules/inventory/application/handlers/ownership-transfer-dispatched.handler'
import { ReturnConfirmedHandler } from '@/modules/inventory/application/handlers/return-confirmed.handler'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserTypeOrmEntity,
      CategoryTypeOrmEntity,
      ProductTypeOrmEntity,
      ProductModelTypeOrmEntity,
      BatchTypeOrmEntity,
      SupplierTypeOrmEntity,
      CustomerTypeOrmEntity,
      ReturnTypeOrmEntity,
      SaleTypeOrmEntity,
      OwnershipTransferTypeOrmEntity,
      ShipmentTypeOrmEntity,
      CustomerPortfolioTypeOrmEntity,
      InventoryTypeOrmEntity
    ]),
    ConfigModule,
    forwardRef(() => AppModule)
  ],
  providers: [
    EventDispatcher,
    CustomLogger,
    SuperuserSeed,
    ResellerSeed,
    SupplierSeed,
    BatchSeed,
    CustomerSeed,
    SaleSeed,
    ReturnSeed,
    OwnershipTransferSeed,
    ShipmentSeed,
    AppConfigService,
    CreateBatchUseCase,
    CreateCategoryUseCase,
    CreateCustomerUseCase,
    CreateOwnershipTransferUseCase,
    CreateReturnUseCase,
    CreateUserUseCase,
    CreateSaleUseCase,
    CreateShipmentUseCase,
    CreateSupplierUseCase,
    GetBatchQtyByMonthUseCase,
    CreateSaleStrategyFactory,
    CreateSaleAdminStrategy,
    CreateSaleResellerStrategy,
    UpdateProductModelUseCase,
    UpdateUserRoleUseCase,
    UpdateStatusShipmentUseCase,
    UpdateReturnStatusUseCase,
    UpdateStatusOwnershipTransferUseCase,
    { provide: 'InventoryService', useClass: InventoryService },
    { provide: 'SalePriceCalculator', useClass: SalePriceCalculatorService },
    {
      provide: 'OwnershipTransferRepository',
      useClass: OwnershipTransferTypeOrmRepository
    },
    { provide: 'ReturnRepository', useClass: ReturnTypeOrmRepository },
    { provide: 'SaleRepository', useClass: SaleTypeOrmRepository },
    { provide: 'ShipmentRepository', useClass: ShipmentTypeOrmRepository },
    { provide: 'SupplierRepository', useClass: SupplierTypeOrmRepository },
    { provide: 'UserRepository', useClass: UserTypeOrmRepository },
    { provide: 'BatchRepository', useClass: BatchTypeOrmRepository },
    { provide: 'CategoryRepository', useClass: CategoryTypeOrmRepository },
    { provide: 'ProductRepository', useClass: ProductTypeOrmRepository },
    { provide: 'InventoryRepository', useClass: InventoryTypeOrmRepository },
    {
      provide: 'ProductModelRepository',
      useClass: ProductModelTypeOrmRepository
    },
    { provide: 'ProductEntryResolver', useClass: ProductEntryResolver },
    { provide: 'AppConfigService', useClass: AppConfigService },
    {
      provide: 'CustomerPortfolioRepository',
      useClass: CustomerPortfolioTypeOrmRepository
    },
    { provide: 'CustomerRepository', useClass: CustomerTypeOrmRepository },
    { provide: 'CloudinaryService', useClass: CloudinaryService },
    { provide: 'CustomerPortfolioService', useClass: CustomerPortfolioService },
    {
      provide: 'InventoryOwnershipVerifier',
      useClass: InventoryOwnershipVerifierService
    },
    ShipmentDispatchedHandler,
    CustomerCreatedHandler,
    OwnershipTransferDispatchedHandler,
    ReturnConfirmedHandler
  ],
  exports: [
    SuperuserSeed,
    ResellerSeed,
    SupplierSeed,
    BatchSeed,
    CustomerSeed,
    SaleSeed,
    ReturnSeed,
    OwnershipTransferSeed,
    ShipmentSeed
  ]
})
export class SeedsModule {}
