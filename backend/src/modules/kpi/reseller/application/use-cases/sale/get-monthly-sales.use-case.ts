import { Inject, Injectable } from '@nestjs/common'
import { UUID } from 'crypto'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { SaleReadRepository } from '@/modules/kpi/reseller/domain/repositories/sale-read.repository'
import { MonthlySalesDto } from '@/modules/kpi/reseller/application/dtos/sale/monthly-sales.dto'

@Injectable()
export class GetMonthlySalesUseCase {
  constructor(
    @Inject('SaleReadRepository')
    private readonly saleReadRepository: SaleReadRepository
  ) {}

  async execute(
    resellerId: UUID,
    qParams: ParamsDto
  ): Promise<MonthlySalesDto[]> {
    return this.saleReadRepository.monthlySales(resellerId, qParams)
  }
}
