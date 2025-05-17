import { SalesByResellerDto } from '@/modules/kpi/application/dtos/sales-by-reseller.dto'
import { SaleReadRepository } from '@/modules/kpi/domain/repositories/sale-read.repository'
import { Injectable, Inject } from '@nestjs/common'
import { UUID } from 'crypto'

@Injectable()
export class GetResellerSalesUseCase {
  constructor(
    @Inject('SaleReadRepository')
    private readonly saleReadRepository: SaleReadRepository
  ) {}

  async execute(id: UUID): Promise<SalesByResellerDto> {
    return await this.saleReadRepository.salesByResellerId(id)
  }
}
