import { SaleReadRepository } from '@/modules/kpi/domain/repositories/sale-read.repository'
import { Injectable, Inject } from '@nestjs/common'
import { SalesInPeriodDto } from '@/modules/kpi/application/dtos/sales-in-period.dto'

@Injectable()
export class GetSalesInPeriodUseCase {
  constructor(
    @Inject('SaleReadRepository')
    private readonly saleReadRepository: SaleReadRepository
  ) {}

  async execute(start: Date, end: Date): Promise<SalesInPeriodDto> {
    return await this.saleReadRepository.SalesInPeriod(start, end)
  }
}
