import { PhoneNumber } from '@/modules/user/domain/value-objects/phone-number.vo'
import { Name } from '@/modules/user/domain/value-objects/name.vo'

export class UpdateSupplierDto {
  constructor(
    public readonly name?: Name,
    public readonly phone?: PhoneNumber
  ) {}
}
