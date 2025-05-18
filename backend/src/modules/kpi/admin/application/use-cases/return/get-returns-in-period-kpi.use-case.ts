import { Injectable, Inject } from '@nestjs/common'
import { ReturnReadRepository } from '@/modules/kpi/admin/domain/repositories/return-read.repository'
import { ReturnsInPeriodDto } from '@/modules/kpi/admin/application/dtos/return/returns-in-period.dto'

@Injectable()
export class GetReturnsInPeriodUseCase {
  constructor(
    @Inject('ReturnReadRepository')
    private readonly returnReadRepository: ReturnReadRepository
  ) {}

  async execute(start: Date, end: Date): Promise<ReturnsInPeriodDto> {
    return await this.returnReadRepository.ReturnsInPeriod(start, end)
  }
}
