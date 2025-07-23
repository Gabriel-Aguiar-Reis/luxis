import { Password } from '@/modules/user/domain/value-objects/password.vo'
import { BadRequestException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { createHash } from 'crypto'

export class PasswordHash {
  @ApiProperty({ description: 'The hashed password of the user', type: String })
  private readonly value: string
  constructor(value: string) {
    if (!this.validate(value))
      throw new BadRequestException('Invalid password hash format')
    this.value = value
  }

  private validate(hash: string): boolean {
    return /^[a-f0-9]{64}$/i.test(hash)
  }

  static generate(password: Password): PasswordHash {
    const hash = createHash('sha256').update(password.getValue()).digest('hex')
    return new PasswordHash(hash)
  }

  getValue(): string {
    return this.value
  }
}
