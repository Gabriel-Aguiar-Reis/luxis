import { BadRequestException } from '@nestjs/common'

export class Password {
  constructor(private readonly value: string) {
    if (!this.validate(value))
      throw new BadRequestException('Invalid password format')
  }

  private validate(password: string): boolean {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s"'`;=\\-]).{10,}$/.test(
      password
    )
  }

  getValue(): string {
    return this.value
  }
}
