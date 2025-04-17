export class PasswordHash {
  constructor(private readonly value: string) {
    if (!this.validate(value)) throw new Error('Invalid password hash format')
  }

  private validate(hash: string): boolean {
    return /^[a-f0-9]{64}$/i.test(hash)
  }

  getValue(): string {
    return this.value
  }
}
