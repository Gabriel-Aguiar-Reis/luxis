import { CreateOwnershipTransferUseCase } from '@/modules/ownership-transfer/application/use-cases/create-ownership-transfer.use-case'
import { DeleteOwnershipTransferUseCase } from '@/modules/ownership-transfer/application/use-cases/delete-ownership-transfer.use-case'
import { GetAllOwnershipTransferUseCase } from '@/modules/ownership-transfer/application/use-cases/get-all-ownership-transfer.use-case'
import { GetOneOwnershipTransferUseCase } from '@/modules/ownership-transfer/application/use-cases/get-one-ownership-transfer.use-case'
import { UpdateOwnershipTransferUseCase } from '@/modules/ownership-transfer/application/use-cases/update-ownership-transfer.use-case'
import { OwnershipTransferController } from '@/modules/ownership-transfer/presentation/ownership-transfer.controller'
import { CaslAbilityFactory } from '@/shared/infra/auth/casl/casl-ability.factory'
import { OwnershipTransferTypeOrmEntity } from '@/shared/infra/persistence/typeorm/ownership-transfer/ownership-transfer.typeorm.entity'
import { OwnershipTransferTypeOrmRepository } from '@/shared/infra/persistence/typeorm/ownership-transfer/ownership-transfer.typeorm.repository'
import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppModule } from '@/app.module'
import { UpdateStatusOwnershipTransferUseCase } from '@/modules/ownership-transfer/application/use-cases/update-status-ownership-transfer.use-case'
import { ProductTypeOrmRepository } from '@/shared/infra/persistence/typeorm/product/product.typeorm.repository'
import { UserTypeOrmRepository } from '@/shared/infra/persistence/typeorm/user/user.typeorm.repository'
import { EventDispatcher } from '@/shared/events/event-dispatcher'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { UserTypeOrmEntity } from '@/shared/infra/persistence/typeorm/user/user.typeorm.entity'
import { AppConfigService } from '@/shared/config/app-config.service'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { OwnershipTransferDispatchedHandler } from '@/modules/inventory/application/handlers/ownership-transfer-dispatched.handler'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OwnershipTransferTypeOrmEntity,
      ProductTypeOrmEntity,
      UserTypeOrmEntity
    ]),
    forwardRef(() => AppModule)
  ],
  controllers: [OwnershipTransferController],
  providers: [
    CustomLogger,
    AppConfigService,
    EventDispatcher,
    OwnershipTransferDispatchedHandler,
    CreateOwnershipTransferUseCase,
    GetAllOwnershipTransferUseCase,
    GetOneOwnershipTransferUseCase,
    UpdateOwnershipTransferUseCase,
    UpdateStatusOwnershipTransferUseCase,
    DeleteOwnershipTransferUseCase,
    {
      provide: 'OwnershipTransferRepository',
      useClass: OwnershipTransferTypeOrmRepository
    },
    {
      provide: 'CaslAbilityFactory',
      useClass: CaslAbilityFactory
    },
    { provide: 'ProductRepository', useClass: ProductTypeOrmRepository },
    { provide: 'UserRepository', useClass: UserTypeOrmRepository }
  ]
})
export class OwnershipTransferModule {}
