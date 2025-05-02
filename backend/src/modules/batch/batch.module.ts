import { Module } from '@nestjs/common'
import { BatchController } from '@/modules/batch/presentation/batch.controller'
import { CreateBatchUseCase } from '@/modules/batch/application/use-cases/create-batch.use-case'
import { DeleteBatchUseCase } from '@/modules/batch/application/use-cases/delete-batch.use-case'
import { GetAllBatchUseCase } from '@/modules/batch/application/use-cases/get-all-batch.use-case'
import { GetOneBatchUseCase } from '@/modules/batch/application/use-cases/get-one-batch.use-case'

// TODO -> Preciso colocar as implementações concretas para todos os tokens deste module
@Module({
  controllers: [BatchController],
  providers: [
    CreateBatchUseCase,
    GetAllBatchUseCase,
    GetOneBatchUseCase,
    DeleteBatchUseCase
  ]
})
export class BatchModule {}
