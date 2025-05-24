import { SaleReadRepository } from '@/modules/kpi/admin/domain/repositories/sale-read.repository'
import { Injectable, Inject } from '@nestjs/common'
import { TotalSalesByResellerDto } from '@/modules/kpi/admin/application/dtos/sale/total-sales-by-reseller.dto'
import { ParamsDto } from '@/shared/common/dtos/params.dto'

@Injectable()
export class GetTotalSalesByResellerUseCase {
  constructor(
    @Inject('SaleReadRepository')
    private readonly saleReadRepository: SaleReadRepository
  ) {}

  async execute(qParams: ParamsDto): Promise<TotalSalesByResellerDto[]> {
    return await this.saleReadRepository.totalSalesByReseller(qParams)
  }
}
