import { BadRequestException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

export class Currency {
  @ApiProperty({
    description: 'The currency value in string format',
    example: '100.00',
    type: String
  })
  private value: string
  constructor(value: string) {
    if (!this.validate(value))
      throw new BadRequestException('Invalid currency format')
    this.value = value
  }

  private validate(currency: string): boolean {
    return /^\d+(\.\d{2})$/.test(currency)
  }

  getValue(): string {
    return this.value
  }
}
