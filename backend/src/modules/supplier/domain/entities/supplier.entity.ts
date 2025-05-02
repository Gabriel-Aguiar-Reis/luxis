import { PhoneNumber } from '@/modules/user/domain/value-objects/phone-number.vo'
import { Name } from '@/modules/user/domain/value-objects/name.vo'
import { UUID } from 'crypto'

export class Supplier {
  constructor(
    public readonly id: UUID,
    public name: Name,
    public phone: PhoneNumber
  ) {}
}
