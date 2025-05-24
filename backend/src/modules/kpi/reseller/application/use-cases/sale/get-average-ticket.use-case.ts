import { Inject, Injectable } from '@nestjs/common'
import { UUID } from 'crypto'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { SaleReadRepository } from '@/modules/kpi/reseller/domain/repositories/sale-read.repository'

@Injectable()
export class GetAverageTicketUseCase {
  constructor(
    @Inject('SaleReadRepository')
    private readonly saleReadRepository: SaleReadRepository
  ) {}

  async execute(resellerId: UUID, qParams: ParamsDto): Promise<number> {
    return this.saleReadRepository.averageTicket(resellerId, qParams)
  }
}
