import { Injectable, Inject } from '@nestjs/common'
import { ReturnDto } from '@/modules/kpi/application/dtos/return.dto'
import { ReturnReadRepository } from '@/modules/kpi/domain/repositories/return-read.repository'

@Injectable()
export class GetReturnsByResellerUseCase {
  constructor(
    @Inject('ReturnReadRepository')
    private readonly returnReadRepository: ReturnReadRepository
  ) {}

  async execute(): Promise<ReturnDto[]> {
    return await this.returnReadRepository.ReturnsByReseller()
  }
}
