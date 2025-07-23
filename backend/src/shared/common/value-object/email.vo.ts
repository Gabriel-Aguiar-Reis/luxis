import { BadRequestException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

export class Email {
  @ApiProperty({ description: 'The email address of the user', type: String })
  private readonly value: string
  constructor(value: string) {
    if (!this.validate(value))
      throw new BadRequestException('Invalid email format')
    this.value = value
  }

  private validate(email: string): boolean {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
  }

  getValue(): string {
    return this.value
  }
}
