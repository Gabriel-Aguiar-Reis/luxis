import { Address } from '@/modules/user/domain/value-objects/address.vo'
import { ApiProperty } from '@nestjs/swagger'

export class Residence {
  @ApiProperty({ description: 'The address of the residence', type: Address })
  public address: Address

  constructor(address: Address) {
    this.address = address
  }

  getValue(): string {
    return this.address.getValue()
  }
}
