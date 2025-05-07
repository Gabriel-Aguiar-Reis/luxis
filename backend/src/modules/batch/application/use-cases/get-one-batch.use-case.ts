import { Batch } from '@/modules/batch/domain/entities/batch.entity'
import { BatchRepository } from '@/modules/batch/domain/repositories/batch.repository'
import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { UUID } from 'crypto'

@Injectable()
export class GetOneBatchUseCase {
  constructor(
    @Inject('BatchRepository')
    private readonly batchRepository: BatchRepository
  ) {}

  async execute(id: UUID): Promise<Batch> {
    const batch = await this.batchRepository.findById(id)
    if (!batch) {
      throw new NotFoundException('Batch not found')
    }
    return batch
  }
}
