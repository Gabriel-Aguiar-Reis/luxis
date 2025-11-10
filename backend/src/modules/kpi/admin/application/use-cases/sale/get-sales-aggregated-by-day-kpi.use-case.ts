import { Inject, Injectable } from '@nestjs/common'
import { SaleReadRepository } from '@/modules/kpi/admin/domain/repositories/sale-read.repository'
import { ParamsWithMandatoryPeriodDto } from '@/shared/common/dtos/params-with-mandatory-period.dto'
import { SalesAggregatedByDayDto } from '@/modules/kpi/admin/application/dtos/sale/sales-aggregated-by-day.dto'

@Injectable()
export class GetSalesAggregatedByDayUseCase {
  constructor(
    @Inject('SaleReadRepository')
    private readonly saleReadRepo: SaleReadRepository
  ) {}

  async execute(
    qParams: ParamsWithMandatoryPeriodDto
  ): Promise<SalesAggregatedByDayDto> {
    return this.saleReadRepo.salesAggregatedByDay(qParams)
  }
}
