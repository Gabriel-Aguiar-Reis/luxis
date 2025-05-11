import { forwardRef, Module } from '@nestjs/common'
import { SupplierController } from '@/modules/supplier/presentation/supplier.controller'
import { CreateSupplierUseCase } from '@/modules/supplier/application/use-cases/create-supplier.use-case'
import { GetAllSupplierUseCase } from '@/modules/supplier/application/use-cases/get-all-supplier.use-case'
import { UpdateSupplierUseCase } from '@/modules/supplier/application/use-cases/update-supplier.use-case'
import { DeleteSupplierUseCase } from '@/modules/supplier/application/use-cases/delete-supplier.use-case'
import { GetOneSupplierUseCase } from '@/modules/supplier/application/use-cases/get-one-supplier.use-case'
import { SupplierTypeOrmRepository } from '@/shared/infra/persistence/typeorm/supplier/supplier.typeorm.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SupplierTypeOrmEntity } from '@/shared/infra/persistence/typeorm/supplier/supplier.typeorm.entity'
import { AppModule } from '@/app.module'
import { CaslAbilityFactory } from '@/shared/infra/auth/casl/casl-ability.factory'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { AppConfigService } from '@/shared/config/app-config.service'
import { GetResellerSalesUseCase } from '@/modules/kpi/application/use-cases/admin/get-sales-by-reseller-kpi'
import { AdminKpiController } from '@/modules/kpi/presentation/admin-kpi.controller'
import { ResellerKpiController } from '@/modules/kpi/presentation/reseller-kpi.controller'
import { ConfigModule } from '@/shared/config/config.module'
import { SaleReadTypeOrmRepository } from '@/shared/infra/persistence/typeorm/kpi/sale-read.typeorm.repository'

@Module({
  imports: [ConfigModule],
  controllers: [AdminKpiController, ResellerKpiController],
  providers: [
    CustomLogger,
    AppConfigService,
    GetResellerSalesUseCase,
    { provide: 'SaleReadRepository', useClass: SaleReadTypeOrmRepository }
  ]
})
export class SupplierModule {}
