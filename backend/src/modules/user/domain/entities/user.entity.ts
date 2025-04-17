import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { Email } from '@/modules/user/domain/value-objects/email.vo'
import { Name } from '@/modules/user/domain/value-objects/name.vo'
import { PhoneNumber } from '@/modules/user/domain/value-objects/phone-number.vo'
import { Residence } from '@/modules/user/domain/value-objects/residence.vo'

export class User {
  constructor(
    public readonly id: string,
    public name: Name,
    public surName: Name,
    public phone: PhoneNumber,
    public email: Email,
    public passwordHash: string,
    public role: Role,
    public residence: Residence
  ) {}
}
