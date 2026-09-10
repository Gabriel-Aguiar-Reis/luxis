import { User } from '@/modules/user/domain/entities/user.entity'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class GetAllUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository
  ) {}

  async execute(user: UserPayload): Promise<User[]> {
    return await this.userRepository.findAll()
  }
}
