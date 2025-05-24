import { SalesByResellerDto } from '@/modules/kpi/admin/application/dtos/sale/sales-by-reseller.dto'
import { SaleReadRepository } from '@/modules/kpi/admin/domain/repositories/sale-read.repository'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { Injectable, Inject } from '@nestjs/common'
import { UUID } from 'crypto'

@Injectable()
export class GetSalesByResellerIdUseCase {
  constructor(
    @Inject('SaleReadRepository')
    private readonly saleReadRepository: SaleReadRepository
  ) {}

  async execute(id: UUID, qParams: ParamsDto): Promise<SalesByResellerDto> {
    return await this.saleReadRepository.salesByResellerId(id, qParams)
  }
}
