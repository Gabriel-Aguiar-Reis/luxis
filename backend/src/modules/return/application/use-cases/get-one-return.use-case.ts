import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { ReturnRepository } from '@/modules/return/domain/repositories/return.repository'
import { UUID } from 'crypto'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Role } from '@/modules/user/domain/enums/user-role.enum'

@Injectable()
export class GetOneReturnUseCase {
  constructor(
    @Inject('ReturnRepository')
    private readonly returnRepository: ReturnRepository
  ) {}

  async execute(id: UUID, user: UserPayload) {
    const returnEntity = await this.returnRepository.findById(id)
    if (!returnEntity) {
      throw new NotFoundException('Return not found')
    }
    if (user.role === Role.RESELLER && returnEntity.resellerId !== user.id) {
      throw new ForbiddenException('You are not allowed to access this return')
    }
    return returnEntity
  }
}
