import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { SaleTypeOrmEntity } from '@/shared/infra/persistence/typeorm/sale/sale.typeorm.entity'
import { AppModule } from '@/app.module'
import { AdminProductKpiController } from '@/modules/kpi/admin/presentation/product-kpi.controller'
import { AdminSaleKpiController } from '@/modules/kpi/admin/presentation/sale-kpi.controller'
import { AdminReturnKpiController } from '@/modules/kpi/admin/presentation/return-kpi.controller'
import { AdminOwnershipTransferKpiController } from '@/modules/kpi/admin/presentation/ownership-transfer-kpi.controller'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { AppConfigService } from '@/shared/config/app-config.service'
import { ResellerKpiControllerGuard } from '@/shared/infra/auth/guards/reseller-kpi-controller.guard'
import { CaslAbilityFactory } from '@/shared/infra/auth/casl/casl-ability.factory'
import { SaleReadTypeormRepository } from '@/shared/infra/persistence/typeorm/kpi/admin/sale-read.typeorm.repository'
import { ProductReadTypeormRepository } from '@/shared/infra/persistence/typeorm/kpi/admin/product-read.typeorm.repository'
import { ReturnReadTypeormRepository } from '@/shared/infra/persistence/typeorm/kpi/admin/return-read.typeorm.repository'
import { OwnershipTransferReadTypeormRepository } from '@/shared/infra/persistence/typeorm/kpi/admin/ownership-transfer-read.typeorm.repository'
import { UserTypeOrmEntity } from '@/shared/infra/persistence/typeorm/user/user.typeorm.entity'
import { GetProductsInStockUseCase } from '@/modules/kpi/admin/application/use-cases/product/get-products-in-stock-kpi.use-case'
import { GetTotalProductsInStockUseCase } from '@/modules/kpi/admin/application/use-cases/product/get-total-products-in-stock-kpi.use-case'
import { GetProductsInStockForMoreThanXDaysUseCase } from '@/modules/kpi/admin/application/use-cases/product/get-products-in-stock-for-more-than-x-days-kpi.use-case'
import { GetTotalProductsInStockForMoreThanXDaysUseCase } from '@/modules/kpi/admin/application/use-cases/product/get-total-products-in-stock-for-more-than-x-days-kpi.use-case'
import { GetTotalProductWithResellersUseCase } from '@/modules/kpi/admin/application/use-cases/product/get-total-products-with-resellers-kpi.use-case'
import { GetSalesByResellerIdUseCase } from '@/modules/kpi/admin/application/use-cases/sale/get-sales-by-reseller-id-kpi.use-case'
import { GetTotalSalesByResellerIdUseCase } from '@/modules/kpi/admin/application/use-cases/sale/get-total-sales-by-reseller-id-kpi.use-case'
import { GetSalesInPeriodUseCase } from '@/modules/kpi/admin/application/use-cases/sale/get-sales-in-period-kpi.use-case'
import { GetTotalSalesInPeriodUseCase } from '@/modules/kpi/admin/application/use-cases/sale/get-total-sales-in-period-kpi.use-case'
import { GetSalesByResellerUseCase } from '@/modules/kpi/admin/application/use-cases/sale/get-sales-by-reseller-kpi.use-case'
import { GetTotalSalesByResellerUseCase } from '@/modules/kpi/admin/application/use-cases/sale/get-total-sales-by-reseller-kpi.use-case'
import { GetTotalBillingByBatchIdUseCase } from '@/modules/kpi/admin/application/use-cases/sale/get-total-billing-by-batch-id-kpi.use-case'
import { GetTotalBillingByResellerIdUseCase } from '@/modules/kpi/admin/application/use-cases/sale/get-total-billing-by-reseller-id-kpi.use-case'
import { GetTotalBillingInPeriodUseCase } from '@/modules/kpi/admin/application/use-cases/sale/get-total-billing-in-period-kpi.use-case'
import { GetReturnsByResellerIdKpiUseCase } from '@/modules/kpi/admin/application/use-cases/return/get-returns-by-reseller-id-kpi.use-case'
import { GetTotalReturnsByResellerIdKpiUseCase } from '@/modules/kpi/admin/application/use-cases/return/get-total-returns-by-reseller-id-kpi.use-case'
import { GetReturnsByResellerUseCase } from '@/modules/kpi/admin/application/use-cases/return/get-returns-by-reseller-kpi.use-case'
import { GetTotalReturnsByResellerUseCase } from '@/modules/kpi/admin/application/use-cases/return/get-total-returns-by-reseller-kpi.use-case'
import { GetReturnsInPeriodUseCase } from '@/modules/kpi/admin/application/use-cases/return/get-returns-in-period-kpi.use-case'
import { GetTotalReturnsInPeriodUseCase } from '@/modules/kpi/admin/application/use-cases/return/get-total-returns-in-period-kpi.use-case'
import { GetOwnershipTransfersByResellerIdKpiUseCase } from '@/modules/kpi/admin/application/use-cases/ownership-transfer/get-ownership-transfers-by-reseller-id-kpi.use-case'
import { GetTotalOwnershipTransfersByResellerIdKpiUseCase } from '@/modules/kpi/admin/application/use-cases/ownership-transfer/get-total-ownership-transfers-by-reseller-id-kpi.use-case'
import { GetOwnershipTransfersInPeriodKpiUseCase } from '@/modules/kpi/admin/application/use-cases/ownership-transfer/get-ownership-transfers-in-period-kpi.use-case'
import { GetTotalOwnershipTransfersInPeriodKpiUseCase } from '@/modules/kpi/admin/application/use-cases/ownership-transfer/get-total-ownership-transfers-in-period-kpi.use-case'
import { GetOwnershipTransfersReceivedByResellerIdKpiUseCase } from '@/modules/kpi/admin/application/use-cases/ownership-transfer/get-ownership-transfers-received-by-reseller-id-kpi.use-case'
import { GetTotalOwnershipTransfersReceivedByResellerIdKpiUseCase } from '@/modules/kpi/admin/application/use-cases/ownership-transfer/get-total-ownership-transfers-received-by-reseller-id-kpi.use-case'
import { GetOwnershipTransfersGivenByResellerIdKpiUseCase } from '@/modules/kpi/admin/application/use-cases/ownership-transfer/get-ownership-transfers-given-by-reseller-id-kpi.use-case'
import { GetTotalOwnershipTransfersGivenByResellerIdKpiUseCase } from '@/modules/kpi/admin/application/use-cases/ownership-transfer/get-total-ownership-transfers-given-by-reseller-id-kpi.use-case'
import { OwnershipTransferTypeOrmEntity } from '@/shared/infra/persistence/typeorm/ownership-transfer/ownership-transfer.typeorm.entity'
import { ReturnTypeOrmEntity } from '@/shared/infra/persistence/typeorm/return/return.typeorm.entity'
@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductTypeOrmEntity,
      SaleTypeOrmEntity,
      UserTypeOrmEntity,
      OwnershipTransferTypeOrmEntity,
      ReturnTypeOrmEntity
    ]),
    forwardRef(() => AppModule)
  ],
  controllers: [
    AdminProductKpiController,
    AdminSaleKpiController,
    AdminReturnKpiController,
    AdminOwnershipTransferKpiController
  ],
  providers: [
    CustomLogger,
    AppConfigService,
    ResellerKpiControllerGuard,
    CaslAbilityFactory,
    GetProductsInStockUseCase,
    GetTotalProductsInStockUseCase,
    GetProductsInStockForMoreThanXDaysUseCase,
    GetTotalProductsInStockForMoreThanXDaysUseCase,
    GetTotalProductWithResellersUseCase,
    GetSalesByResellerIdUseCase,
    GetTotalSalesByResellerIdUseCase,
    GetSalesInPeriodUseCase,
    GetTotalSalesInPeriodUseCase,
    GetSalesByResellerUseCase,
    GetTotalSalesByResellerUseCase,
    GetTotalBillingByBatchIdUseCase,
    GetTotalBillingByResellerIdUseCase,
    GetTotalBillingInPeriodUseCase,
    GetReturnsByResellerIdKpiUseCase,
    GetTotalReturnsByResellerIdKpiUseCase,
    GetReturnsByResellerUseCase,
    GetTotalReturnsByResellerUseCase,
    GetReturnsInPeriodUseCase,
    GetTotalReturnsInPeriodUseCase,
    GetOwnershipTransfersByResellerIdKpiUseCase,
    GetTotalOwnershipTransfersByResellerIdKpiUseCase,
    GetOwnershipTransfersInPeriodKpiUseCase,
    GetTotalOwnershipTransfersInPeriodKpiUseCase,
    GetOwnershipTransfersReceivedByResellerIdKpiUseCase,
    GetTotalOwnershipTransfersReceivedByResellerIdKpiUseCase,
    GetOwnershipTransfersGivenByResellerIdKpiUseCase,
    GetTotalOwnershipTransfersGivenByResellerIdKpiUseCase,
    { provide: 'CaslAbilityFactory', useClass: CaslAbilityFactory },
    {
      provide: 'ProductReadRepository',
      useClass: ProductReadTypeormRepository
    },
    { provide: 'SaleReadRepository', useClass: SaleReadTypeormRepository },
    { provide: 'ReturnReadRepository', useClass: ReturnReadTypeormRepository },
    {
      provide: 'OwnershipTransferReadRepository',
      useClass: OwnershipTransferReadTypeormRepository
    }
  ]
})
export class AdminKpiModule {}
