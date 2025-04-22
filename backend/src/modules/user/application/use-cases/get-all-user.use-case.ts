import { User } from '@/modules/user/domain/entities/user.entity'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class GetAllUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepo: UserRepository
  ) {}

  async execute(): Promise<User[]> {
    return await this.userRepo.findAll()
  }
}
