export class Currency {
  constructor(private readonly value: string) {
    if (!this.validate(value)) throw new Error('Invalid currency format')
  }

  private validate(email: string): boolean {
    return /^\d+(\.\d{2})$/.test(email)
  }

  getValue(): string {
    return this.value
  }
}
