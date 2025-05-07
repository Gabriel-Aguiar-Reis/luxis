import { CreateReturnUseCase } from '@/modules/return/application/use-cases/create-return.use-case'
import { DeleteReturnUseCase } from '@/modules/return/application/use-cases/delete-return.use-case'
import { GetAllReturnUseCase } from '@/modules/return/application/use-cases/get-all-return.use-case'
import { GetOneReturnUseCase } from '@/modules/return/application/use-cases/get-one-return.use-case'
import { UpdateReturnUseCase } from '@/modules/return/application/use-cases/update-return.use-case'
import { UpdateReturnStatusUseCase } from '@/modules/return/application/use-cases/update-return-status.use-case'
import { ReturnController } from '@/modules/return/presentation/return.controller'
import { ReturnTypeOrmRepository } from '@/shared/infra/persistence/typeorm/return/return.typeorm.repository'
import { Module, forwardRef } from '@nestjs/common'
import { ReturnConfirmedHandler } from '../inventory/application/handlers/return-confirmed.handler'
import { EventDispatcher } from '@/shared/events/event-dispatcher'
import { InventoryService } from '@/modules/inventory/application/services/inventory.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ReturnTypeOrmEntity } from '@/shared/infra/persistence/typeorm/return/return.typeorm.entity'
import { AppConfigService } from '@/shared/config/app-config.service'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { InventoryTypeOrmRepository } from '@/shared/infra/persistence/typeorm/inventory/inventory.typeorm.repository'
import { InventoryTypeOrmEntity } from '@/shared/infra/persistence/typeorm/inventory/inventory.typeorm.entity'
import { AppModule } from '@/app.module'
import { CaslAbilityFactory } from '@/shared/infra/auth/casl/casl-ability.factory'

@Module({
  imports: [
    TypeOrmModule.forFeature([ReturnTypeOrmEntity, InventoryTypeOrmEntity]),
    forwardRef(() => AppModule)
  ],
  controllers: [ReturnController],
  providers: [
    CustomLogger,
    AppConfigService,
    CreateReturnUseCase,
    GetAllReturnUseCase,
    GetOneReturnUseCase,
    UpdateReturnUseCase,
    DeleteReturnUseCase,
    UpdateReturnStatusUseCase,
    ReturnConfirmedHandler,
    EventDispatcher,
    { provide: 'ReturnRepository', useClass: ReturnTypeOrmRepository },
    { provide: 'InventoryService', useClass: InventoryService },
    { provide: 'InventoryRepository', useClass: InventoryTypeOrmRepository },
    { provide: 'CaslAbilityFactory', useClass: CaslAbilityFactory }
  ]
})
export class ReturnModule {}
