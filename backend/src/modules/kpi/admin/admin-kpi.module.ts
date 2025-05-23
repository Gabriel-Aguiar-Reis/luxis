import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { SaleTypeOrmEntity } from '@/shared/infra/persistence/typeorm/sale/sale.typeorm.entity'
import { AppModule } from '@/app.module'
import { AdminProductKpiController } from '@/modules/kpi/admin/presentation/product-kpi.controller'
import { AdminSaleKpiController } from '@/modules/kpi/admin/presentation/sale-kpi.controller'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { AppConfigService } from '@/shared/config/app-config.service'
import { ResellerKpiControllerGuard } from '@/shared/infra/auth/guards/reseller-kpi-controller.guard'
import { CaslAbilityFactory } from '@/shared/infra/auth/casl/casl-ability.factory'
import { SaleReadTypeormRepository } from '@/shared/infra/persistence/typeorm/kpi/admin/sale-read.typeorm.repository'
import { ProductReadTypeormRepository } from '@/shared/infra/persistence/typeorm/kpi/admin/product-read.typeorm.repository'
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
@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductTypeOrmEntity,
      SaleTypeOrmEntity,
      UserTypeOrmEntity
    ]),
    forwardRef(() => AppModule)
  ],
  controllers: [AdminProductKpiController, AdminSaleKpiController],
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
    { provide: 'CaslAbilityFactory', useClass: CaslAbilityFactory },
    {
      provide: 'ProductReadRepository',
      useClass: ProductReadTypeormRepository
    },
    { provide: 'SaleReadRepository', useClass: SaleReadTypeormRepository }
  ]
})
export class AdminKpiModule {}
