import { Inject, Injectable } from '@nestjs/common'
import { OwnershipTransferReadRepository } from '@/modules/kpi/admin/domain/repositories/ownership-transfer-read.repository'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { UUID } from 'crypto'

@Injectable()
export class GetOwnershipTransfersByResellerIdKpiUseCase {
  constructor(
    @Inject('OwnershipTransferReadRepository')
    private readonly repository: OwnershipTransferReadRepository
  ) {}

  execute(id: UUID, qParams: ParamsDto) {
    return this.repository.ownershipTransfersByResellerId(id, qParams)
  }
}
