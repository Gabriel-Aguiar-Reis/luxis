import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ReturnRepository } from '@/modules/return/domain/repositories/return.repository'
import { UUID } from 'crypto'

@Injectable()
export class DeleteReturnUseCase {
  constructor(
    @Inject('ReturnRepository')
    private readonly returnRepository: ReturnRepository
  ) {}

  async execute(id: UUID) {
    const returnEntity = await this.returnRepository.findById(id)
    if (!returnEntity) {
      throw new NotFoundException('Return not found')
    }

    await this.returnRepository.delete(id)
  }
}
