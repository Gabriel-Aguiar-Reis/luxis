import { Batch } from '@/modules/batch/domain/entities/batch.entity'
import { BatchRepository } from '@/modules/batch/domain/repositories/batch.repository'
import { CreateBatchDto } from '@/modules/batch/presentation/dtos/create-batch.dto'
import { Injectable, Inject } from '@nestjs/common'

@Injectable()
export class CreateBatchUseCase {
  constructor(
    @Inject('BatchRepository')
    private readonly batchRepository: BatchRepository
  ) {}

  async execute(input: CreateBatchDto): Promise<Batch> {
    const batch = new Batch(
      crypto.randomUUID(),
      input.arrivalDate,
      input.supplierId,
      input.items
    )

    return this.batchRepository.create(batch)
  }
}
