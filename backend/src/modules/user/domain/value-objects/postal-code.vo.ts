import { BadRequestException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

export class PostalCode {
  @ApiProperty({
    description: 'The postal code in the format XXXXX-XXX',
    example: '01001000',
    type: String
  })
  private value: string
  constructor(value: string) {
    if (!this.validate(value))
      throw new BadRequestException('Invalid postal code format')
    this.value = value
  }

  private validate(postalCode: string): boolean {
    return /^\d{5}\d{3}$/.test(postalCode)
  }

  getValue(): string {
    return this.value
  }
}
