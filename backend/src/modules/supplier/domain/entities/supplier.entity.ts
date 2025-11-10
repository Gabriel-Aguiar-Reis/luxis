import { PhoneNumber } from '@/modules/user/domain/value-objects/phone-number.vo'
import { Name } from '@/modules/user/domain/value-objects/name.vo'
import { UUID } from 'crypto'
import { ApiProperty } from '@nestjs/swagger'
import { SupplierName } from '@/modules/supplier/domain/value-objects/supplier-name.vo'

export class Supplier {
  @ApiProperty({
    description: 'The ID of the supplier',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public readonly id: UUID

  @ApiProperty({
    description: 'The name of the supplier',
    example: 'Apple Inc.',
    type: SupplierName
  })
  public name: SupplierName

  @ApiProperty({
    description: 'The phone number of the supplier',
    example: '+5511999999999',
    type: PhoneNumber
  })
  public phone: PhoneNumber

  constructor(id: UUID, name: SupplierName, phone: PhoneNumber) {
    this.id = id
    this.name = name
    this.phone = phone
  }
}
