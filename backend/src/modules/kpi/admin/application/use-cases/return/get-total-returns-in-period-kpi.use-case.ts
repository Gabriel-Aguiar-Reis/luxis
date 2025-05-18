import { Injectable, Inject } from '@nestjs/common'
import { ReturnReadRepository } from '@/modules/kpi/admin/domain/repositories/return-read.repository'
import { TotalReturnsInPeriodDto } from '@/modules/kpi/admin/application/dtos/return/total-returns-in-period.dto'

@Injectable()
export class GetTotalReturnsInPeriodUseCase {
  constructor(
    @Inject('ReturnReadRepository')
    private readonly returnReadRepository: ReturnReadRepository
  ) {}

  async execute(start: Date, end: Date): Promise<TotalReturnsInPeriodDto> {
    return await this.returnReadRepository.TotalReturnsInPeriod(start, end)
  }
}
