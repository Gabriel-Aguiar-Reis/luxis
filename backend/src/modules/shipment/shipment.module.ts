import { CreateShipmentUseCase } from '@/modules/shipment/application/use-cases/create-shipment.use-case'
import { DeleteShipmentUseCase } from '@/modules/shipment/application/use-cases/delete-shipment.use-case'
import { GetAllShipmentUseCase } from '@/modules/shipment/application/use-cases/get-all-shipment.use-case'
import { GetOneShipmentUseCase } from '@/modules/shipment/application/use-cases/get-one-shipment.use-case'
import { UpdateShipmentUseCase } from '@/modules/shipment/application/use-cases/update-shipment.use-case'
import { ShipmentController } from '@/modules/shipment/presentation/shipment.controller'
import { ShipmentTypeOrmRepository } from '@/shared/infra/persistence/typeorm/shipment/shipment.typeorm.repository'
import { Module } from '@nestjs/common'

@Module({
  controllers: [ShipmentController],
  providers: [
    CreateShipmentUseCase,
    GetAllShipmentUseCase,
    GetOneShipmentUseCase,
    UpdateShipmentUseCase,
    DeleteShipmentUseCase,
    { provide: 'ShipmentRepository', useClass: ShipmentTypeOrmRepository }
  ]
})
export class ShipmentModule {}
