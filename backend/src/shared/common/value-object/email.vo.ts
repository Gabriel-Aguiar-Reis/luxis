export class Email {
  constructor(private readonly value: string) {
    if (!this.validate(value)) throw new Error('Invalid email format')
  }

  private validate(email: string): boolean {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
  }

  getValue(): string {
    return this.value
  }
}
