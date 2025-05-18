import { SalesByResellerDto } from '@/modules/kpi/admin/application/dtos/sale/sales-by-reseller.dto'
import { SaleReadRepository } from '@/modules/kpi/admin/domain/repositories/sale-read.repository'
import { Injectable, Inject } from '@nestjs/common'

@Injectable()
export class GetSalesByResellerUseCase {
  constructor(
    @Inject('SaleReadRepository')
    private readonly saleReadRepository: SaleReadRepository
  ) {}

  async execute(start?: Date, end?: Date): Promise<SalesByResellerDto[]> {
    return await this.saleReadRepository.salesByReseller(start, end)
  }
}
