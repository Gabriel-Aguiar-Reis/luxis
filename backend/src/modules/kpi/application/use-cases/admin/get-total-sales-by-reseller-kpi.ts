import { SaleReadRepository } from '@/modules/kpi/domain/repositories/sale-read.repository'
import { Injectable, Inject } from '@nestjs/common'
import { TotalSalesByResellerDto } from '@/modules/kpi/application/dtos/total-sales-by-reseller.dto'

@Injectable()
export class GetTotalSalesByResellerUseCase {
  constructor(
    @Inject('SaleReadRepository')
    private readonly saleReadRepository: SaleReadRepository
  ) {}

  async execute(): Promise<TotalSalesByResellerDto[]> {
    return await this.saleReadRepository.totalSalesByReseller()
  }
}
