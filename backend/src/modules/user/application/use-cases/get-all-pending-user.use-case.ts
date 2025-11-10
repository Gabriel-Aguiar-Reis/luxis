import { User } from '@/modules/user/domain/entities/user.entity'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class GetAllPendingUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository
  ) {}

  async execute(user: UserPayload): Promise<User[]> {
    if (user.role === Role.RESELLER) {
      throw new UnauthorizedException(
        'You do not have permission to access this resource'
      )
    }
    return await this.userRepository.findAllPending()
  }
}
