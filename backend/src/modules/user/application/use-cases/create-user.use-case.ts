import { User } from '@/modules/user/domain/entities/user.entity'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UserStatus } from '@/modules/user/domain/enums/user-status.enum'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { Address } from '@/modules/user/domain/value-objects/address.vo'
import { Name } from '@/modules/user/domain/value-objects/name.vo'
import { PasswordHash } from '@/modules/user/domain/value-objects/password-hash.vo'
import { PhoneNumber } from '@/modules/user/domain/value-objects/phone-number.vo'
import { Password } from '@/modules/user/domain/value-objects/password.vo'
import { PostalCode } from '@/modules/user/domain/value-objects/postal-code.vo'
import { Email } from '@/shared/common/value-object/email.vo'
import { Residence } from '@/modules/user/domain/value-objects/residence.vo'
import { CreateUserDto } from '@/modules/user/presentation/dtos/create-user.dto'
import { Injectable, Inject } from '@nestjs/common'
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepo: UserRepository
  ) {}
  async execute(input: CreateUserDto): Promise<User> {
    let passwordHash = PasswordHash.generate(new Password(input.password))
    const address = new Address(
      input.street,
      input.number,
      input.neighborhood,
      input.city,
      input.federativeUnit,
      new PostalCode(input.postalCode),
      input.country,
      input.complement
    )
    const residence = new Residence(address)
    const user = new User(
      crypto.randomUUID(),
      new Name(input.name),
      new Name(input.surName),
      new PhoneNumber(input.phone),
      new Email(input.email),
      passwordHash,
      Role.UNASSIGNED,
      residence,
      UserStatus.PENDING
    )
    return await this.userRepo.create(user)
  }
}
