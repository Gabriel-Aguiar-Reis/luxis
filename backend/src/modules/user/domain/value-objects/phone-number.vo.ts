export class PhoneNumber {
  constructor(private readonly value: string) {
    if (!this.validate(value)) throw new Error('Invalid phone number format')
  }

  private validate(phoneNumber: string): boolean {
    return /^(\(?[0-9]{2}\)?)? ?([0-9]{4,5})-?([0-9]{4})$/gm.test(phoneNumber)
  }

  getValue(): string {
    return this.value
  }
}
