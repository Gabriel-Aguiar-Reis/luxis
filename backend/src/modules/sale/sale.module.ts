import { CreateSaleUseCase } from '@/modules/sale/application/use-cases/create/create-sale.use-case'
import { SaleTypeOrmRepository } from '@/shared/infra/persistence/typeorm/sale/sale.typeorm.repository'
import { forwardRef, Module } from '@nestjs/common'
import { GetOneSaleUseCase } from '@/modules/sale/application/use-cases/get-one/get-one-sale.use-case'
import { SalePriceCalculatorService } from '@/modules/sale/application/services/sale-price-calculator.service'
import { SaleController } from '@/modules/sale/presentation/sale.controller'
import { InventoryOwnershipVerifierService } from '@/modules/sale/application/services/inventory-ownership-verify.service'
import { UpdateSaleUseCase } from '@/modules/sale/application/use-cases/update/update-sale.use-case'
import { GetAllSaleUseCase } from '@/modules/sale/application/use-cases/get-all-sale.use-case'
import { DeleteSaleUseCase } from '@/modules/sale/application/use-cases/delete-sale.use-case'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SaleTypeOrmEntity } from '@/shared/infra/persistence/typeorm/sale/sale.typeorm.entity'
import { CreateSaleStrategyFactory } from '@/modules/sale/application/use-cases/create/strategies/create-sale.strategy.factory'
import { GetOneSaleStrategyFactory } from '@/modules/sale/application/use-cases/get-one/strategies/get-one-sale.strategy.factory'
import { UpdateSaleStrategyFactory } from '@/modules/sale/application/use-cases/update/strategies/update-sale.strategy.factory'
import { CreateSaleResellerStrategy } from '@/modules/sale/application/use-cases/create/strategies/create-sale-reseller.strategy'
import { CreateSaleAdminStrategy } from '@/modules/sale/application/use-cases/create/strategies/create-sale-admin.strategy'
import { ProductTypeOrmRepository } from '@/shared/infra/persistence/typeorm/product/product.typeorm.repository'
import { GetOneSaleResellerStrategy } from '@/modules/sale/application/use-cases/get-one/strategies/get-one-sale-reseller.strategy'
import { GetOneSaleAdminOrAssistantStrategy } from '@/modules/sale/application/use-cases/get-one/strategies/get-one-sale-admin-or-assistant.strategy'
import { UpdateSaleResellerStrategy } from '@/modules/sale/application/use-cases/update/strategies/update-sale-reseller.strategy'
import { UpdateSaleAdminStrategy } from '@/modules/sale/application/use-cases/update/strategies/update-sale-admin.strategy'
import { InventoryService } from '@/modules/inventory/application/services/inventory.service'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { InventoryTypeOrmRepository } from '@/shared/infra/persistence/typeorm/inventory/inventory.typeorm.repository'
import { InventoryTypeOrmEntity } from '@/shared/infra/persistence/typeorm/inventory/inventory.typeorm.entity'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { AppConfigService } from '@/shared/config/app-config.service'
import { AppModule } from '@/app.module'
import { CaslAbilityFactory } from '@/shared/infra/auth/casl/casl-ability.factory'
import { MarkInstallmentPaidUseCase } from '@/modules/sale/application/use-cases/mark-installment-paid.use-case'
import { UpdateSaleStatusUseCase } from '@/modules/sale/application/use-cases/update-sale-status.use-case'
import { CustomerTypeOrmRepository } from '@/shared/infra/persistence/typeorm/customer/customer.typeorm.repository'
import { CategoryTypeOrmRepository } from '@/shared/infra/persistence/typeorm/category/category.typeorm.repository'
import { ProductModelTypeOrmRepository } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.repository'
import { UserTypeOrmRepository } from '@/shared/infra/persistence/typeorm/user/user.typeorm.repository'
import { CategoryTypeOrmEntity } from '@/shared/infra/persistence/typeorm/category/category.typeorm.entity'
import { CustomerTypeOrmEntity } from '@/shared/infra/persistence/typeorm/customer/customer.typeorm.entity'
import { ProductModelTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.entity'
import { UserTypeOrmEntity } from '@/shared/infra/persistence/typeorm/user/user.typeorm.entity'
import { GetAvailableProductsToSellUseCase } from '@/modules/sale/application/use-cases/get-available-products-to-sell.use-case'
import { ConfirmSaleUseCase } from '@/modules/sale/application/use-cases/confirm-sale.use-case'
@Module({
  imports: [
    TypeOrmModule.forFeature([
      SaleTypeOrmEntity,
      ProductTypeOrmEntity,
      InventoryTypeOrmEntity,
      CustomerTypeOrmEntity,
      CategoryTypeOrmEntity,
      ProductModelTypeOrmEntity,
      UserTypeOrmEntity
    ]),
    forwardRef(() => AppModule)
  ],
  controllers: [SaleController],
  providers: [
    CustomLogger,
    AppConfigService,
    CreateSaleUseCase,
    GetOneSaleUseCase,
    GetAllSaleUseCase,
    UpdateSaleUseCase,
    DeleteSaleUseCase,
    ConfirmSaleUseCase,
    UpdateSaleStatusUseCase,
    MarkInstallmentPaidUseCase,
    GetAvailableProductsToSellUseCase,
    CreateSaleStrategyFactory,
    CreateSaleResellerStrategy,
    CreateSaleAdminStrategy,
    GetOneSaleStrategyFactory,
    GetOneSaleResellerStrategy,
    GetOneSaleAdminOrAssistantStrategy,
    UpdateSaleStrategyFactory,
    UpdateSaleResellerStrategy,
    UpdateSaleAdminStrategy,
    { provide: 'SaleRepository', useClass: SaleTypeOrmRepository },
    { provide: 'SalePriceCalculator', useClass: SalePriceCalculatorService },
    {
      provide: 'InventoryOwnershipVerifier',
      useClass: InventoryOwnershipVerifierService
    },
    { provide: 'ProductRepository', useClass: ProductTypeOrmRepository },
    { provide: 'CustomerRepository', useClass: CustomerTypeOrmRepository },
    { provide: 'UserRepository', useClass: UserTypeOrmRepository },
    { provide: 'CategoryRepository', useClass: CategoryTypeOrmRepository },
    {
      provide: 'ProductModelRepository',
      useClass: ProductModelTypeOrmRepository
    },
    { provide: 'InventoryRepository', useClass: InventoryTypeOrmRepository },
    { provide: 'InventoryService', useClass: InventoryService },
    { provide: 'CaslAbilityFactory', useClass: CaslAbilityFactory }
  ]
})
export class SaleModule {}
