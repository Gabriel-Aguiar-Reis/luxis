import { Inject, Injectable } from '@nestjs/common'
import { UUID } from 'crypto'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { ReturnReadRepository } from '@/modules/kpi/reseller/domain/repositories/return-read.repository'

@Injectable()
export class GetReturnsMadeByResellerUseCase {
  constructor(
    @Inject('ReturnReadRepository')
    private readonly returnReadRepository: ReturnReadRepository
  ) {}

  async execute(resellerId: UUID, qParams: ParamsDto): Promise<number> {
    return this.returnReadRepository.returnsMadeByResellerId(resellerId, qParams)
  }
}
