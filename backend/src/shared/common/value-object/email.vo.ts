import { BadRequestException } from '@nestjs/common'

export class Email {
  constructor(private readonly value: string) {
    if (!this.validate(value))
      throw new BadRequestException('Invalid email format')
  }

  private validate(email: string): boolean {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
  }

  getValue(): string {
    return this.value
  }
}
