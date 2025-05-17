import { Module } from '@nestjs/common'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { AppConfigService } from '@/shared/config/app-config.service'
import { GetResellerSalesUseCase } from '@/modules/kpi/application/use-cases/admin/get-sales-by-reseller-kpi.use-case'
import { AdminKpiController } from '@/modules/kpi/presentation/admin-kpi.controller'
import { ResellerKpiController } from '@/modules/kpi/presentation/reseller-kpi.controller'
import { ConfigModule } from '@/shared/config/config.module'
import { SaleReadTypeOrmRepository } from '@/shared/infra/persistence/typeorm/kpi/sale-read.typeorm.repository'
import { ProductReadTypeOrmRepository } from '@/shared/infra/persistence/typeorm/kpi/product-read.typeorm.repository'
import { ReturnReadTypeOrmRepository } from '@/shared/infra/persistence/typeorm/kpi/return-read.typeorm.repository'

@Module({
  imports: [ConfigModule],
  controllers: [AdminKpiController, ResellerKpiController],
  providers: [
    CustomLogger,
    AppConfigService,
    GetResellerSalesUseCase,
    { provide: 'SaleReadRepository', useClass: SaleReadTypeOrmRepository },
    {
      provide: 'ProductReadRepository',
      useClass: ProductReadTypeOrmRepository
    },
    { provide: 'ReturnReadRepository', useClass: ReturnReadTypeOrmRepository }
  ]
})
export class KpiModule {}
