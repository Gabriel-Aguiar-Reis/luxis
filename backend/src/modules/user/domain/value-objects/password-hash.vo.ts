import { Password } from '@/modules/user/domain/value-objects/password.vo'
import { BadRequestException } from '@nestjs/common'
import { createHash } from 'crypto'

export class PasswordHash {
  constructor(private readonly value: string) {
    if (!this.validate(value))
      throw new BadRequestException('Invalid password hash format')
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
