import { CreateReturnUseCase } from '@/modules/return/application/use-cases/create-return.use-case'
import { DeleteReturnUseCase } from '@/modules/return/application/use-cases/delete-return.use-case'
import { GetAllReturnUseCase } from '@/modules/return/application/use-cases/get-all-return.use-case'
import { GetOneReturnUseCase } from '@/modules/return/application/use-cases/get-one-return.use-case'
import { UpdateReturnUseCase } from '@/modules/return/application/use-cases/update-return.use-case'
import { UpdateReturnStatusUseCase } from '@/modules/return/application/use-cases/update-return-status.use-case'
import { ReturnController } from '@/modules/return/presentation/return.controller'
import { ReturnTypeOrmRepository } from '@/shared/infra/persistence/typeorm/return/return.typeorm.repository'
import { Module } from '@nestjs/common'
import { ReturnConfirmedHandler } from '../inventory/application/handlers/return-confirmed.handler'
import { EventDispatcher } from '@/shared/events/event-dispatcher'
import { InventoryService } from '@/modules/inventory/application/services/inventory.service'

@Module({
  controllers: [ReturnController],
  providers: [
    CreateReturnUseCase,
    GetAllReturnUseCase,
    GetOneReturnUseCase,
    UpdateReturnUseCase,
    DeleteReturnUseCase,
    UpdateReturnStatusUseCase,
    ReturnConfirmedHandler,
    EventDispatcher,
    { provide: 'ReturnRepository', useClass: ReturnTypeOrmRepository },
    { provide: 'InventoryService', useClass: InventoryService }
  ]
})
export class ReturnModule {}
