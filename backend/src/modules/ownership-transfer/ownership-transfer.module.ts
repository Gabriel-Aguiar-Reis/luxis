import { CreateOwnershipTransferUseCase } from '@/modules/ownership-transfer/application/use-cases/create-ownership-transfer.use-case'
import { DeleteOwnershipTransferUseCase } from '@/modules/ownership-transfer/application/use-cases/delete-ownership-transfer.use-case'
import { GetAllOwnershipTransferUseCase } from '@/modules/ownership-transfer/application/use-cases/get-all-ownership-transfer.use-case'
import { GetOneOwnershipTransferUseCase } from '@/modules/ownership-transfer/application/use-cases/get-one-ownership-transfer.use-case'
import { UpdateOwnershipTransferUseCase } from '@/modules/ownership-transfer/application/use-cases/update-ownership-transfer.use-case'
import { OwnershipTransferController } from '@/modules/ownership-transfer/presentation/ownership-transfer.controller'
import { OwnershipTransferTypeOrmRepository } from '@/shared/infra/persistence/typeorm/ownership-transfer/ownership-transfer.typeorm.repository'
import { Module } from '@nestjs/common'

// TODO -> Preciso colocar as implementações concretas para todos os tokens deste module
@Module({
  controllers: [OwnershipTransferController],
  providers: [
    CreateOwnershipTransferUseCase,
    GetAllOwnershipTransferUseCase,
    GetOneOwnershipTransferUseCase,
    UpdateOwnershipTransferUseCase,
    DeleteOwnershipTransferUseCase,
    {
      provide: 'OwnershipTransferRepository',
      useClass: OwnershipTransferTypeOrmRepository
    }
  ]
})
export class OwnershipTransferModule {}
