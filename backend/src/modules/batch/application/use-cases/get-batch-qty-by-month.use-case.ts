import { BatchRepository } from '@/modules/batch/domain/repositories/batch.repository'
import { Injectable, Inject } from '@nestjs/common'

@Injectable()
export class GetBatchQtyByMonthUseCase {
  constructor(
    @Inject('BatchRepository')
    private readonly batchRepository: BatchRepository
  ) {}

  async execute(date: Date): Promise<number> {
    let batches = await this.batchRepository.findAllByMonthAndYear(
      date.getMonth() + 1,
      date.getFullYear()
    )
    return batches.length
  }
}
