import { User } from '@/modules/user/domain/entities/user.entity'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'

import { UUID } from 'crypto'

@Injectable()
export class GetOneUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepo: UserRepository
  ) {}

  async execute(id: UUID, user: UserPayload): Promise<User> {
    const userData = await this.userRepo.findById(id)
    if (!userData) {
      throw new NotFoundException('User not found')
    }

    if (user.role === Role.RESELLER && user.id !== userData.id) {
      throw new UnauthorizedException(
        'You do not have permission to access this resource'
      )
    }

    return userData
  }
}
