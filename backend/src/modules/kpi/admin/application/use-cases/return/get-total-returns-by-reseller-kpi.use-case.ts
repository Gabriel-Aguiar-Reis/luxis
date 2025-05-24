import { Injectable, Inject } from '@nestjs/common'
import { ReturnReadRepository } from '@/modules/kpi/admin/domain/repositories/return-read.repository'
import { TotalReturnsByResellerDto } from '@/modules/kpi/admin/application/dtos/return/total-returns-by-reseller.dto'
import { ParamsDto } from '@/shared/common/dtos/params.dto'

@Injectable()
export class GetTotalReturnsByResellerUseCase {
  constructor(
    @Inject('ReturnReadRepository')
    private readonly returnReadRepository: ReturnReadRepository
  ) {}

  async execute(qParams: ParamsDto): Promise<TotalReturnsByResellerDto[]> {
    return await this.returnReadRepository.TotalReturnsByReseller(qParams)
  }
}
