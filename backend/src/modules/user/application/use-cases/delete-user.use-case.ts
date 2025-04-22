import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { UUID } from 'crypto'

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepo: UserRepository
  ) {}

  async execute(id: UUID): Promise<void> {
    let user = await this.userRepo.findById(id)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return await this.userRepo.delete(id)
  }
}
