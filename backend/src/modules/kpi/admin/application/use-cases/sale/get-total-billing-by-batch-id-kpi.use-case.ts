import { Injectable, Inject } from '@nestjs/common'
import { SaleReadRepository } from '@/modules/kpi/admin/domain/repositories/sale-read.repository'
import { TotalBillingReturnDto } from '@/modules/kpi/admin/application/dtos/sale/total-billing-return.dto'
import { UUID } from 'crypto'

@Injectable()
export class GetTotalBillingByBatchIdUseCase {
  constructor(
    @Inject('SaleReadRepository')
    private readonly saleReadRepo: SaleReadRepository
  ) {}

  async execute(batchId: UUID): Promise<TotalBillingReturnDto> {
    return this.saleReadRepo.totalBillingByBatchId(batchId)
  }
}
