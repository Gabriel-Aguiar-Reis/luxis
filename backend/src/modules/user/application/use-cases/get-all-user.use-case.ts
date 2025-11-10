import { User } from '@/modules/user/domain/entities/user.entity'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class GetAllUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository
  ) {}

  async execute(user: UserPayload): Promise<User[]> {
    return await this.userRepository.findAll()
  }
}
