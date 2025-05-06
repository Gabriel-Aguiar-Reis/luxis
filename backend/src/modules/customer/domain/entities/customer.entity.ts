import { PhoneNumber } from '@/modules/user/domain/value-objects/phone-number.vo'
import { Name } from '@/modules/user/domain/value-objects/name.vo'
import { UUID } from 'crypto'
import { ApiProperty } from '@nestjs/swagger'

export class Customer {
  @ApiProperty({
    description: 'The ID of the customer',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public readonly id: UUID

  @ApiProperty({
    description: 'The name of the customer',
    example: 'John Doe',
    type: String
  })
  public name: Name

  @ApiProperty({
    description: 'The phone number of the customer',
    example: '+5511999999999',
    type: String
  })
  public phone: PhoneNumber

  constructor(id: UUID, name: Name, phone: PhoneNumber) {
    this.id = id
    this.name = name
    this.phone = phone
  }
}
