import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppModule } from '@/app.module'

import { ResellerSaleKpiController } from '@/modules/kpi/reseller/presentation/controllers/sale-kpi.controller'
import { ResellerInventoryKpiController } from '@/modules/kpi/reseller/presentation/controllers/inventory-kpi.controller'
import { ResellerProductKpiController } from '@/modules/kpi/reseller/presentation/controllers/product-kpi.controller'
import { ResellerReturnKpiController } from '@/modules/kpi/reseller/presentation/controllers/return-kpi.controller'

import { GetMonthlySalesUseCase } from '@/modules/kpi/reseller/application/use-cases/sale/get-monthly-sales.use-case'
import { GetAverageTicketUseCase } from '@/modules/kpi/reseller/application/use-cases/sale/get-average-ticket.use-case'
import { GetCurrentInventoryUseCase } from '@/modules/kpi/reseller/application/use-cases/inventory/get-current-inventory.use-case'
import { GetTopSellingProductsUseCase } from '@/modules/kpi/reseller/application/use-cases/product/get-top-selling-products.use-case'
import { GetProductsWithLongestTimeInInventoryUseCase } from '@/modules/kpi/reseller/application/use-cases/product/get-products-with-longest-time-in-inventory.use-case'
import { GetReturnsMadeByResellerUseCase } from '@/modules/kpi/reseller/application/use-cases/return/get-returns-made-by-reseller.use-case'

import { SaleReadTypeormRepository } from '@/shared/infra/persistence/typeorm/kpi/reseller/sale-read.typeorm.repository'
import { InventoryReadTypeormRepository } from '@/shared/infra/persistence/typeorm/kpi/reseller/inventory-read.typeorm.repository'
import { ProductReadTypeormRepository } from '@/shared/infra/persistence/typeorm/kpi/reseller/product-read.typeorm.repository'
import { ReturnReadTypeormRepository } from '@/shared/infra/persistence/typeorm/kpi/reseller/return-read.typeorm.repository'

import { SaleTypeOrmEntity } from '@/shared/infra/persistence/typeorm/sale/sale.typeorm.entity'
import { InventoryTypeOrmEntity } from '@/shared/infra/persistence/typeorm/inventory/inventory.typeorm.entity'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { ProductModelTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.entity'
import { ReturnTypeOrmEntity } from '@/shared/infra/persistence/typeorm/return/return.typeorm.entity'

import { CaslAbilityFactory } from '@/shared/infra/auth/casl/casl-ability.factory'
import { ResellerKpiControllerGuard } from '@/shared/infra/auth/guards/reseller-kpi-controller.guard'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { AppConfigService } from '@/shared/config/app-config.service'
@Module({
  imports: [
    TypeOrmModule.forFeature([
      SaleTypeOrmEntity,
      InventoryTypeOrmEntity,
      ProductTypeOrmEntity,
      ProductModelTypeOrmEntity,
      ReturnTypeOrmEntity
    ]),
    forwardRef(() => AppModule)
  ],
  controllers: [
    ResellerSaleKpiController,
    ResellerInventoryKpiController,
    ResellerProductKpiController,
    ResellerReturnKpiController
  ],
  providers: [
    CustomLogger,
    AppConfigService,
    GetMonthlySalesUseCase,
    GetAverageTicketUseCase,
    GetCurrentInventoryUseCase,
    GetTopSellingProductsUseCase,
    GetProductsWithLongestTimeInInventoryUseCase,
    GetReturnsMadeByResellerUseCase,
    ResellerKpiControllerGuard,
    { provide: 'CaslAbilityFactory', useClass: CaslAbilityFactory },
    { provide: 'SaleReadRepository', useClass: SaleReadTypeormRepository },
    {
      provide: 'InventoryReadRepository',
      useClass: InventoryReadTypeormRepository
    },
    {
      provide: 'ProductReadRepository',
      useClass: ProductReadTypeormRepository
    },
    { provide: 'ReturnReadRepository', useClass: ReturnReadTypeormRepository }
  ]
})
export class ResellerKpiModule {}
