import { Password } from '@/modules/user/domain/value-objects/password.vo'
import { hash } from 'crypto'

export class PasswordHash {
  constructor(private readonly value: string) {
    if (!this.validate(value)) throw new Error('Invalid password hash format')
  }

  private validate(hash: string): boolean {
    return /^[a-f0-9]{64}$/i.test(hash)
  }

  static generate(password: Password): PasswordHash {
    return new PasswordHash(hash(password.getValue(), 'sha256'))
  }

  getValue(): string {
    return this.value
  }
}
