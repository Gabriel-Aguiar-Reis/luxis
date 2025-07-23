import { BadRequestException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

export class Password {
  @ApiProperty({ description: 'The password of the user', type: String })
  private readonly value: string
  constructor(value: string) {
    if (!this.validate(value))
      throw new BadRequestException('Invalid password format')
    this.value = value
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
