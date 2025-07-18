import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UserStatus } from '@/modules/user/domain/enums/user-status.enum'
import { Email } from '@/shared/common/value-object/email.vo'
import { Name } from '@/modules/user/domain/value-objects/name.vo'
import { PasswordHash } from '@/modules/user/domain/value-objects/password-hash.vo'
import { PhoneNumber } from '@/modules/user/domain/value-objects/phone-number.vo'
import { Residence } from '@/modules/user/domain/value-objects/residence.vo'
import { UUID } from 'crypto'
import { ApiProperty } from '@nestjs/swagger'

export class User {
  @ApiProperty({
    description: 'The ID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public readonly id: UUID

  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
    type: Name
  })
  public name: Name

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
    type: Name
  })
  public surname: Name

  @ApiProperty({
    description: 'The phone number of the user',
    example: '+5511999999999',
    type: PhoneNumber
  })
  public phone: PhoneNumber

  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
    type: Email
  })
  public email: Email

  @ApiProperty({
    description: 'The hashed password of the user',
    example: '$2b$10$abcdefghijklmnopqrstuvwxyz',
    type: String
  })
  public passwordHash: PasswordHash

  @ApiProperty({
    description: 'The role of the user',
    enum: Role,
    example: Role.RESELLER,
  })
  public role: Role

  @ApiProperty({
    description: 'The residence information of the user',
    example: {
      address: {
        street: 'Rua do Sistema',
        number: '1',
        neighborhood: 'Centro',
        city: 'São Paulo',
        federativeUnit: 'SP',
        postalCode: {
          value: '01001000'
        },
        country: 'Brasil',
        complement: 'Sistema'
    }
    },
    type: Residence
  })
  public residence: Residence

  @ApiProperty({
    description: 'The status of the user',
    enum: UserStatus,
    example: UserStatus.ACTIVE
  })
  public status: UserStatus

  constructor(
    id: UUID,
    name: Name,
    surname: Name,
    phone: PhoneNumber,
    email: Email,
    passwordHash: PasswordHash,
    role: Role,
    residence: Residence,
    status: UserStatus
  ) {
    this.id = id
    this.name = name
    this.surname = surname
    this.phone = phone
    this.email = email
    this.passwordHash = passwordHash
    this.role = role
    this.residence = residence
    this.status = status
  }
}
