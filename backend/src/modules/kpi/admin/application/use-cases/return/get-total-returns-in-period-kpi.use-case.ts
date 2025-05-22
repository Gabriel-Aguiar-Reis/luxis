import { Injectable, Inject } from '@nestjs/common'
import { ReturnReadRepository } from '@/modules/kpi/admin/domain/repositories/return-read.repository'
import { TotalReturnsInPeriodDto } from '@/modules/kpi/admin/application/dtos/return/total-returns-in-period.dto'
import { ParamsWithMandatoryPeriodDto } from '@/shared/common/dtos/params-with-mandatory-period.dto'

@Injectable()
export class GetTotalReturnsInPeriodUseCase {
  constructor(
    @Inject('ReturnReadRepository')
    private readonly returnReadRepository: ReturnReadRepository
  ) {}

  async execute(
    qParams: ParamsWithMandatoryPeriodDto
  ): Promise<TotalReturnsInPeriodDto> {
    return await this.returnReadRepository.TotalReturnsInPeriod(qParams)
  }
}
