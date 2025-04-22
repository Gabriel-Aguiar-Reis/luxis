import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { User } from '@/modules/user/domain/entities/user.entity'
import { UUID } from 'crypto'

@Injectable()
export class UpdateUserRoleUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepo: UserRepository
  ) {}

  async execute(id: UUID, role: Role): Promise<User> {
    let user = await this.userRepo.findById(id)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return await this.userRepo.updateRole(id, role)
  }
}
