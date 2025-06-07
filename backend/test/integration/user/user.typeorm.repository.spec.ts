import { testDataSource } from '../../test-datasource'
import { UserTypeOrmRepository } from '@/shared/infra/persistence/typeorm/user/user.typeorm.repository'
import { UserTypeOrmEntity } from '@/shared/infra/persistence/typeorm/user/user.typeorm.entity'
import { User } from '@/modules/user/domain/entities/user.entity'
import { Country } from '@/modules/user/domain/enums/country.enum'
import { FederativeUnit } from '@/modules/user/domain/enums/federative-unit.enum'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UserStatus } from '@/modules/user/domain/enums/user-status.enum'
import { Address } from '@/modules/user/domain/value-objects/address.vo'
import { Name } from '@/modules/user/domain/value-objects/name.vo'
import { PasswordHash } from '@/modules/user/domain/value-objects/password-hash.vo'
import { Password } from '@/modules/user/domain/value-objects/password.vo'
import { PhoneNumber } from '@/modules/user/domain/value-objects/phone-number.vo'
import { PostalCode } from '@/modules/user/domain/value-objects/postal-code.vo'
import { Residence } from '@/modules/user/domain/value-objects/residence.vo'
import { Email } from '@/shared/common/value-object/email.vo'

describe('UserTypeOrmRepository (integration)', () => {
  let repo: UserTypeOrmRepository

  beforeAll(async () => {
    await testDataSource.initialize()
    const userRepo = testDataSource.getRepository(UserTypeOrmEntity)
    repo = new UserTypeOrmRepository(userRepo)
  })

  afterAll(async () => {
    await testDataSource.destroy()
  })

  it('should save and return user', async () => {
    const user = await repo.create(
      new User(
        'f07b1624-2939-4951-a809-957e2637576c',
        new Name('John'),
        new Name('Doe'),
        new PhoneNumber('12912345678'),
        new Email('john.doe@example.com'),
        PasswordHash.generate(new Password('Password123*')),
        Role.ADMIN,
        new Residence(
          new Address(
            'Main St',
            123,
            'Apt 4B',
            'São Paulo',
            FederativeUnit.SP,
            new PostalCode('12345678'),
            Country.BRAZIL
          )
        ),
        UserStatus.ACTIVE
      )
    )

    expect(user.id).toBe('f07b1624-2939-4951-a809-957e2637576c')
    expect(user.name.getValue()).toBe(new Name('John').getValue())
    expect(user.surname.getValue()).toBe(new Name('Doe').getValue())
    expect(user.phone.getValue()).toBe(
      new PhoneNumber('12912345678').getValue()
    )
    expect(user.email.getValue()).toBe(
      new Email('john.doe@example.com').getValue()
    )
    expect(user.passwordHash.getValue()).toBe(
      PasswordHash.generate(new Password('Password123*')).getValue()
    )
    expect(user.role).toBe(Role.ADMIN)
    expect(user.residence.getValue()).toBe(
      new Residence(
        new Address(
          'Main St',
          123,
          'Apt 4B',
          'São Paulo',
          FederativeUnit.SP,
          new PostalCode('12345678'),
          Country.BRAZIL
        )
      ).getValue()
    )
    expect(user.status).toBe(UserStatus.ACTIVE)
  })
})
