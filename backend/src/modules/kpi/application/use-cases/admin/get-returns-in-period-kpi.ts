import { Injectable, Inject } from '@nestjs/common'
import { ReturnReadRepository } from '@/modules/kpi/domain/repositories/return-read.repository'
import { ReturnsInPeriodDto } from '@/modules/kpi/application/dtos/returns-in-period.dto'

@Injectable()
export class GetReturnsByResellerUseCase {
  constructor(
    @Inject('ReturnReadRepository')
    private readonly returnReadRepository: ReturnReadRepository
  ) {}

  async execute(start: Date, end: Date): Promise<ReturnsInPeriodDto> {
    return await this.returnReadRepository.ReturnsInPeriod(start, end)
  }
}
