import { Inject, Injectable } from '@nestjs/common'
import { OwnershipTransferReadRepository } from '@/modules/kpi/admin/domain/repositories/ownership-transfer-read.repository'
import { ParamsWithMandatoryPeriodDto } from '@/shared/common/dtos/params-with-mandatory-period.dto'

@Injectable()
export class GetTotalOwnershipTransfersInPeriodKpiUseCase {
  constructor(
    @Inject('OwnershipTransferReadRepository')
    private readonly repository: OwnershipTransferReadRepository
  ) {}

  execute(qParams: ParamsWithMandatoryPeriodDto) {
    return this.repository.totalOwnershipTransfersInPeriod(qParams)
  }
}
