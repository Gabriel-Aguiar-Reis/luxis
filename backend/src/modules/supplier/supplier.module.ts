import { Module } from '@nestjs/common'
import { SupplierController } from '@/modules/supplier/presentation/supplier.controller'
import { CreateSupplierUseCase } from '@/modules/supplier/application/use-cases/create-supplier.use-case'
import { GetAllSuppliersUseCase } from '@/modules/supplier/application/use-cases/get-all-supplier.use-case'
import { UpdateSupplierUseCase } from '@/modules/supplier/application/use-cases/update-supplier.use-case'
import { DeleteSupplierUseCase } from '@/modules/supplier/application/use-cases/delete-supplier.use-case'
import { GetOneSuppliersUseCase } from '@/modules/supplier/application/use-cases/get-one-supplier.use-case'
import { SupplierTypeOrmRepository } from '@/shared/infra/persistence/typeorm/supplier/supplier.typeorm.repository'

@Module({
  controllers: [SupplierController],
  providers: [
    CreateSupplierUseCase,
    GetAllSuppliersUseCase,
    GetOneSuppliersUseCase,
    UpdateSupplierUseCase,
    DeleteSupplierUseCase,
    { provide: 'SupplierRepository', useClass: SupplierTypeOrmRepository }
  ]
})
export class SupplierModule {}
