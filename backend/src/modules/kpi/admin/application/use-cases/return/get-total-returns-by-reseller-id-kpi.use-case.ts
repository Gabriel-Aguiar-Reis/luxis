import { Inject, Injectable } from '@nestjs/common'
import { ReturnReadRepository } from '@/modules/kpi/admin/domain/repositories/return-read.repository'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { UUID } from 'crypto'

@Injectable()
export class GetTotalReturnsByResellerIdKpiUseCase {
  constructor(
    @Inject('ReturnReadRepository')
    private readonly repository: ReturnReadRepository
  ) {}

  execute(resellerId: UUID, qParams: ParamsDto) {
    return this.repository.TotalReturnsByResellerId(resellerId, qParams)
  }
}
