export class PostalCode {
  constructor(private readonly value: string) {
    if (!this.validate(value)) throw new Error('Invalid postal code format')
  }

  private validate(postalCode: string): boolean {
    return /\d{5}-\d{3}/gm.test(postalCode)
  }

  getValue(): string {
    return this.value
  }
}
