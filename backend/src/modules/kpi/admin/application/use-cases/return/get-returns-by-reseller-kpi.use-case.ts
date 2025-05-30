import { Injectable, Inject } from '@nestjs/common'
import { ReturnReadRepository } from '@/modules/kpi/admin/domain/repositories/return-read.repository'
import { ReturnByResellerDto } from '@/modules/kpi/admin/application/dtos/return/return-by-reseller.dto'
import { ParamsDto } from '@/shared/common/dtos/params.dto'

@Injectable()
export class GetReturnsByResellerUseCase {
  constructor(
    @Inject('ReturnReadRepository')
    private readonly returnReadRepository: ReturnReadRepository
  ) {}

  async execute(qParams: ParamsDto): Promise<ReturnByResellerDto[]> {
    return await this.returnReadRepository.ReturnsByReseller(qParams)
  }
}
