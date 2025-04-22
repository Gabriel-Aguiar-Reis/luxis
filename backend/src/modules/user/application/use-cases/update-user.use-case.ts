import { User } from '@/modules/user/domain/entities/user.entity'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { Address } from '@/modules/user/domain/value-objects/address.vo'
import { PasswordHash } from '@/modules/user/domain/value-objects/password-hash.vo'
import { Residence } from '@/modules/user/domain/value-objects/residence.vo'
import { UpdateUserDto } from '@/modules/user/presentation/dtos/update-user.dto'
import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { UUID } from 'crypto'

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepo: UserRepository
  ) {}

  async execute(id: UUID, input: UpdateUserDto): Promise<User> {
    let user = await this.userRepo.findById(id)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    const address = new Address(
      input.street,
      input.number,
      input.neighborhood,
      input.city,
      input.federativeUnit,
      input.postalCode,
      input.country,
      input.complement
    )
    const residence = new Residence(address)
    user! = new User(
      id,
      input.name ?? user.name,
      input.surName ?? user.surName,
      input.phone ?? user.phone,
      input.email ?? user.email,
      PasswordHash.generate(input.password) ?? user.passwordHash,
      user.role,
      residence ?? user.residence,
      user.status
    )
    return user
  }
}
