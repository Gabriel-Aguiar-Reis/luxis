import { forwardRef, Module } from '@nestjs/common'
import { SupplierController } from '@/modules/supplier/presentation/supplier.controller'
import { CreateSupplierUseCase } from '@/modules/supplier/application/use-cases/create-supplier.use-case'
import { GetAllSuppliersUseCase } from '@/modules/supplier/application/use-cases/get-all-supplier.use-case'
import { UpdateSupplierUseCase } from '@/modules/supplier/application/use-cases/update-supplier.use-case'
import { DeleteSupplierUseCase } from '@/modules/supplier/application/use-cases/delete-supplier.use-case'
import { GetOneSuppliersUseCase } from '@/modules/supplier/application/use-cases/get-one-supplier.use-case'
import { SupplierTypeOrmRepository } from '@/shared/infra/persistence/typeorm/supplier/supplier.typeorm.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SupplierTypeOrmEntity } from '@/shared/infra/persistence/typeorm/supplier/supplier.typeorm.entity'
import { AppModule } from '@/app.module'
import { CaslAbilityFactory } from '@/shared/infra/auth/casl/casl-ability.factory'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { AppConfigService } from '@/shared/config/app-config.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([SupplierTypeOrmEntity]),
    forwardRef(() => AppModule)
  ],
  controllers: [SupplierController],
  providers: [
    CustomLogger,
    AppConfigService,
    CreateSupplierUseCase,
    GetAllSuppliersUseCase,
    GetOneSuppliersUseCase,
    UpdateSupplierUseCase,
    DeleteSupplierUseCase,
    { provide: 'SupplierRepository', useClass: SupplierTypeOrmRepository },
    { provide: 'CaslAbilityFactory', useClass: CaslAbilityFactory }
  ]
})
export class SupplierModule {}
