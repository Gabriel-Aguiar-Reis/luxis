import { User } from '@/modules/user/domain/entities/user.entity'
import { UserStatus } from '@/modules/user/domain/enums/user-status.enum'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { Address } from '@/modules/user/domain/value-objects/address.vo'
import { PasswordHash } from '@/modules/user/domain/value-objects/password-hash.vo'
import { Residence } from '@/modules/user/domain/value-objects/residence.vo'
import { CreateUserDto } from '@/modules/user/presentation/dtos/create-user.dto'
import { Injectable, Inject } from '@nestjs/common'

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepo: UserRepository
  ) {}
  async execute(input: CreateUserDto): Promise<User> {
    let passwordHash = PasswordHash.generate(input.password)
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
    const user = new User(
      crypto.randomUUID(),
      input.name,
      input.surName,
      input.phone,
      input.email,
      passwordHash,
      input.role,
      residence,
      UserStatus.ACTIVE
    )
    return await this.userRepo.create(user)
  }
}
