import { SalesByResellerDto } from '@/modules/kpi/application/dtos/sales-by-reseller.dto'
import { SalesByResellerMapper } from '@/shared/infra/persistence/typeorm/kpi/mappers/sales-by-reseller.mapper'
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
    const entity = await this.saleReadRepository.totalSalesByResellerId(id)
    return SalesByResellerMapper.toDto(entity)
  }
}
