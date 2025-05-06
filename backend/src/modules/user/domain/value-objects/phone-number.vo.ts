import { BadRequestException } from '@nestjs/common'

export class PhoneNumber {
  constructor(private readonly value: string) {
    if (!this.validate(value))
      throw new BadRequestException('Invalid phone number format')
  }

  private validate(phoneNumber: string): boolean {
    return /^(\+55\s?)?(\(?[0-9]{2}\)?)?\s?([0-9]{4,5})-?([0-9]{4})$/gm.test(
      phoneNumber
    )
  }

  getValue(): string {
    return this.value
  }
}
