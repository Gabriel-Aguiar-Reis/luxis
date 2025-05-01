import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UserStatus } from '@/modules/user/domain/enums/user-status.enum'
import { Email } from '@/shared/common/value-object/email.vo'
import { Name } from '@/modules/user/domain/value-objects/name.vo'
import { PasswordHash } from '@/modules/user/domain/value-objects/password-hash.vo'
import { PhoneNumber } from '@/modules/user/domain/value-objects/phone-number.vo'
import { Residence } from '@/modules/user/domain/value-objects/residence.vo'
import { UUID } from 'crypto'

export class User {
  constructor(
    public readonly id: UUID,
    public name: Name,
    public surName: Name,
    public phone: PhoneNumber,
    public email: Email,
    public passwordHash: PasswordHash,
    public role: Role,
    public residence: Residence,
    public status: UserStatus
  ) {}
}
