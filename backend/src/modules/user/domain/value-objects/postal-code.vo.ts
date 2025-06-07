import { BadRequestException } from '@nestjs/common'

export class PostalCode {
  constructor(private readonly value: string) {
    if (!this.validate(value))
      throw new BadRequestException('Invalid postal code format')
  }

  private validate(postalCode: string): boolean {
    return /^\d{5}\d{3}$/.test(postalCode)
  }

  getValue(): string {
    return this.value
  }
}
