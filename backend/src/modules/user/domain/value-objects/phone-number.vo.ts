import { BadRequestException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

export class PhoneNumber {
  @ApiProperty({ description: 'The phone number of the user', type: String })
  private value: string
  constructor(value: string) {
    if (!this.validate(value))
      throw new BadRequestException('Invalid phone number format')
    this.value = value
  }

  private validate(phoneNumber: string): boolean {
    return /^(\(?[0-9]{2}\)?)?\s?([0-9]{4,5})-?\s?([0-9]{4})$/gm.test(phoneNumber)
  }

  getValue(): string {
    return this.value
  }
}
