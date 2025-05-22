import { SaleReadRepository } from '@/modules/kpi/admin/domain/repositories/sale-read.repository'
import { Injectable, Inject } from '@nestjs/common'
import { SalesInPeriodDto } from '@/modules/kpi/admin/application/dtos/sale/sales-in-period.dto'
import { ParamsWithMandatoryPeriodDto } from '@/shared/common/dtos/params-with-mandatory-period.dto'

@Injectable()
export class GetSalesInPeriodUseCase {
  constructor(
    @Inject('SaleReadRepository')
    private readonly saleReadRepository: SaleReadRepository
  ) {}

  async execute(
    qParams: ParamsWithMandatoryPeriodDto
  ): Promise<SalesInPeriodDto> {
    return await this.saleReadRepository.salesInPeriod(qParams)
  }
}
