import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ReturnRepository } from '@/modules/return/domain/repositories/return.repository'
import { UUID } from 'crypto'
import { UpdateReturnDto } from '@/modules/return/presentation/dtos/update-return-dto'
import { Return } from '@/modules/return/domain/entities/return.entity'

@Injectable()
export class UpdateReturnUseCase {
  constructor(
    @Inject('ReturnRepository')
    private readonly returnRepository: ReturnRepository
  ) {}

  async execute(id: UUID, input: UpdateReturnDto) {
    let returnEntity = await this.returnRepository.findById(id)
    if (!returnEntity) {
      throw new NotFoundException('Return not found')
    }

    returnEntity = new Return(
      returnEntity.id,
      input.resellerId ?? returnEntity.resellerId,
      input.items ?? returnEntity.items,
      returnEntity.status,
      returnEntity.createdAt
    )

    await this.returnRepository.update(returnEntity)
  }
}
