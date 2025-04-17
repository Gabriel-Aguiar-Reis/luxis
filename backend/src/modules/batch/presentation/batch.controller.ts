import { CreateBatchUseCase } from '@/modules/batch/application/use-cases/create-batch.use-case'
import { CreateBatchDto } from '@/modules/batch/presentation/dtos/create-batch.dto'
import { Controller, Post, Body } from '@nestjs/common'

@Controller('batches')
export class BatchController {
  constructor(private readonly createBatch: CreateBatchUseCase) {}

  @Post()
  create(@Body() dto: CreateBatchDto) {
    return this.createBatch.execute(dto)
  }
}
