import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { ReturnRepository } from '@/modules/return/domain/repositories/return.repository'
import { UUID } from 'crypto'
import { UpdateReturnDto } from '@/modules/return/application/dtos/update-return-dto'
import { Return } from '@/modules/return/domain/entities/return.entity'
import { ReturnStatus } from '@/modules/return/domain/enums/return-status.enum'

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

    if (returnEntity.status !== ReturnStatus.PENDING) {
      throw new BadRequestException('Return is not pending')
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
