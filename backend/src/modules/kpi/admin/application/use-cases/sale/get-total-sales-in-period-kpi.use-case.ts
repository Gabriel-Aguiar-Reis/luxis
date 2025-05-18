import { SaleReadRepository } from '@/modules/kpi/admin/domain/repositories/sale-read.repository'
import { Injectable, Inject } from '@nestjs/common'
import { TotalSalesInPeriodDto } from '@/modules/kpi/admin/application/dtos/sale/total-sales-in-period.dto'

@Injectable()
export class GetTotalSalesInPeriodUseCase {
  constructor(
    @Inject('SaleReadRepository')
    private readonly saleReadRepository: SaleReadRepository
  ) {}

  async execute(start: Date, end: Date): Promise<TotalSalesInPeriodDto> {
    return await this.saleReadRepository.totalSalesInPeriod(start, end)
  }
}
