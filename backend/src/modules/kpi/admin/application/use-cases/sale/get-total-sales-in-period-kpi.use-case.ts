import { SaleReadRepository } from '@/modules/kpi/admin/domain/repositories/sale-read.repository'
import { Injectable, Inject } from '@nestjs/common'
import { TotalSalesInPeriodDto } from '@/modules/kpi/admin/application/dtos/sale/total-sales-in-period.dto'
import { ParamsWithMandatoryPeriodDto } from '@/shared/common/dtos/params-with-mandatory-period.dto'

@Injectable()
export class GetTotalSalesInPeriodUseCase {
  constructor(
    @Inject('SaleReadRepository')
    private readonly saleReadRepository: SaleReadRepository
  ) {}

  async execute(
    qParams: ParamsWithMandatoryPeriodDto
  ): Promise<TotalSalesInPeriodDto> {
    return await this.saleReadRepository.totalSalesInPeriod(qParams)
  }
}
