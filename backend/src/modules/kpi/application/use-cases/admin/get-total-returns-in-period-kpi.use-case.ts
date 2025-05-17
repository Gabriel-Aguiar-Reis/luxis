import { Injectable, Inject } from '@nestjs/common'
import { ReturnReadRepository } from '@/modules/kpi/domain/repositories/return-read.repository'
import { TotalReturnsInPeriodDto } from '@/modules/kpi/application/dtos/total-returns-in-period.dto'

@Injectable()
export class GetTotalReturnsByResellerUseCase {
  constructor(
    @Inject('ReturnReadRepository')
    private readonly returnReadRepository: ReturnReadRepository
  ) {}

  async execute(start: Date, end: Date): Promise<TotalReturnsInPeriodDto> {
    return await this.returnReadRepository.TotalReturnsInPeriod(start, end)
  }
}
