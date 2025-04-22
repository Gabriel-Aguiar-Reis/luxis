import { User } from '@/modules/user/domain/entities/user.entity'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'

import { UUID } from 'crypto'

@Injectable()
export class GetOneUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepo: UserRepository
  ) {}

  async execute(id: UUID): Promise<User> {
    const user = await this.userRepo.findById(id)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return user
  }
}
