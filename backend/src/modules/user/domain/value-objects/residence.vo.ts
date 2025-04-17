import { Address } from '@/modules/user/domain/value-objects/address.vo'

export class Residence {
  constructor(public readonly address: Address) {}

  getFullAddress(): string {
    return this.address.toString()
  }
}
