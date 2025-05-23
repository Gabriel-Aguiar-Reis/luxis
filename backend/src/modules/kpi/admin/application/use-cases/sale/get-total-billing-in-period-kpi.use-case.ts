import { Injectable, Inject } from '@nestjs/common'
import { SaleReadRepository } from '@/modules/kpi/admin/domain/repositories/sale-read.repository'
import { TotalBillingReturnDto } from '@/modules/kpi/admin/application/dtos/sale/total-billing-return.dto'
import { ParamsWithMandatoryPeriodDto } from '@/shared/common/dtos/params-with-mandatory-period.dto'

@Injectable()
export class GetTotalBillingInPeriodUseCase {
  constructor(
    @Inject('SaleReadRepository')
    private readonly saleReadRepo: SaleReadRepository
  ) {}

  async execute(
    qParams: ParamsWithMandatoryPeriodDto
  ): Promise<TotalBillingReturnDto> {
    return this.saleReadRepo.totalBillingByPeriod(qParams)
  }
}
