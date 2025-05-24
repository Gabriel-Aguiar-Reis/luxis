import { Injectable, Inject } from '@nestjs/common'
import { SaleReadRepository } from '@/modules/kpi/admin/domain/repositories/sale-read.repository'
import { TotalBillingReturnDto } from '@/modules/kpi/admin/application/dtos/sale/total-billing-return.dto'
import { ParamsWithMandatoryPeriodDto } from '@/shared/common/dtos/params-with-mandatory-period.dto'
import { UUID } from 'crypto'

@Injectable()
export class GetTotalBillingByResellerIdUseCase {
  constructor(
    @Inject('SaleReadRepository')
    private readonly saleReadRepo: SaleReadRepository
  ) {}

  async execute(
    resellerId: UUID,
    qParams: ParamsWithMandatoryPeriodDto
  ): Promise<TotalBillingReturnDto> {
    return this.saleReadRepo.totalBillingByResellerId(resellerId, qParams)
  }
}
