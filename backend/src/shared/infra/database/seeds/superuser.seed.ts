import { Injectable, Inject, ForbiddenException } from '@nestjs/common'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UserStatus } from '@/modules/user/domain/enums/user-status.enum'
import { Name } from '@/modules/user/domain/value-objects/name.vo'
import { Email } from '@/shared/common/value-object/email.vo'
import { PhoneNumber } from '@/modules/user/domain/value-objects/phone-number.vo'
import { PasswordHash } from '@/modules/user/domain/value-objects/password-hash.vo'
import { Residence } from '@/modules/user/domain/value-objects/residence.vo'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { AppConfigService } from '@/shared/config/app-config.service'
import { Address } from '@/modules/user/domain/value-objects/address.vo'
import { FederativeUnit } from '@/modules/user/domain/enums/federative-unit.enum'
import { Country } from '@/modules/user/domain/enums/country.enum'
import { PostalCode } from '@/modules/user/domain/value-objects/postal-code.vo'
import { Password } from '@/modules/user/domain/value-objects/password.vo'

@Injectable()
export class SuperuserSeed {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly appConfigService: AppConfigService
  ) {}

  async run(): Promise<void> {
    if (
      !this.appConfigService.getSuperuserEmail() ||
      !this.appConfigService.getSuperuserName() ||
      !this.appConfigService.getSuperuserSurName() ||
      !this.appConfigService.getSuperuserPassword() ||
      !this.appConfigService.getSuperuserPhone()
    ) {
      throw new ForbiddenException('Superuser configuration is missing')
    }

    const password = new Password(this.appConfigService.getSuperuserPassword()!)
    const passwordHash = PasswordHash.generate(password)
    const defaultAddress = new Address(
      'Rua do Sistema',
      1,
      'Centro',
      'São Paulo',
      FederativeUnit.SP,
      new PostalCode('01001000'),
      Country.BRAZIL,
      'Sistema'
    )

    await this.userRepository.create({
      id: crypto.randomUUID(),
      name: new Name(this.appConfigService.getSuperuserName()!),
      surName: new Name(this.appConfigService.getSuperuserSurName()!),
      email: new Email(this.appConfigService.getSuperuserEmail()!),
      phone: new PhoneNumber(this.appConfigService.getSuperuserPhone()!),
      passwordHash,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      residence: new Residence(defaultAddress)
    })
  }
}
