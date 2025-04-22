import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { User } from '@/modules/user/domain/entities/user.entity'
import { UUID } from 'crypto'

@Injectable()
export class DisableUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepo: UserRepository
  ) {}

  async execute(id: UUID): Promise<User> {
    let user = await this.userRepo.findById(id)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return await this.userRepo.disable(id)
  }
}
