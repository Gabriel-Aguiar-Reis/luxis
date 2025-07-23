import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { User } from '@/modules/user/domain/entities/user.entity'
import { UUID } from 'crypto'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { UpdateUserStatusDto } from '@/modules/user/application/dtos/update-user-status.dto'
@Injectable()
export class UpdateUserStatusUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepo: UserRepository
  ) {}

  async execute(
    id: UUID,
    dto: UpdateUserStatusDto,
    user: UserPayload
  ): Promise<User> {
    let userData = await this.userRepo.findById(id)
    if (!userData) {
      throw new NotFoundException('User not found')
    }

    if (user.role === Role.RESELLER) {
      throw new UnauthorizedException(
        'You do not have permission to perform this action'
      )
    }

    return await this.userRepo.updateStatus(id, dto.status)
  }
}
