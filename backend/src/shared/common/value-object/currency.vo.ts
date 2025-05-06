import { BadRequestException } from '@nestjs/common'

export class Currency {
  constructor(private readonly value: string) {
    if (!this.validate(value))
      throw new BadRequestException('Invalid currency format')
  }

  private validate(currency: string): boolean {
    return /^\d+(\.\d{2})$/.test(currency)
  }

  getValue(): string {
    return this.value
  }
}
