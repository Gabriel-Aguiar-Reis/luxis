import { Batch } from '@/modules/batch/domain/entities/batch.entity'
import { BatchRepository } from '@/modules/batch/domain/repositories/batch.repository'
import { Injectable, Inject } from '@nestjs/common'

@Injectable()
export class GetAllBatchUseCase {
  constructor(
    @Inject('BatchRepository')
    private readonly batchRepository: BatchRepository
  ) {}

  async execute(): Promise<Batch[]> {
    return await this.batchRepository.findAll()
  }
}
