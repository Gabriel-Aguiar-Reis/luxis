import { SaleReadRepository } from '@/modules/kpi/admin/domain/repositories/sale-read.repository'
import { Injectable, Inject } from '@nestjs/common'
import { TotalSalesByResellerDto } from '@/modules/kpi/admin/application/dtos/sale/total-sales-by-reseller.dto'
import { UUID } from 'crypto'

@Injectable()
export class GetTotalSalesByResellerIdUseCase {
  constructor(
    @Inject('SaleReadRepository')
    private readonly saleReadRepository: SaleReadRepository
  ) {}

  async execute(
    resellerId: UUID,
    start: Date,
    end: Date
  ): Promise<TotalSalesByResellerDto> {
    return await this.saleReadRepository.totalSalesByResellerId(
      resellerId,
      start,
      end
    )
  }
}
