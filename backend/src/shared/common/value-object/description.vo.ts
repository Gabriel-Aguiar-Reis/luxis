export class Description {
  constructor(private value: string) {
    const cleaned = value.trim()

    if (cleaned.length === 0) {
      throw new Error('Description cannot be empty')
    }

    if (cleaned.length > 500) {
      throw new Error('Description must be 500 characters or less')
    }

    this.value = cleaned
  }

  static create(value: string): Description {
    return new Description(value)
  }

  getValue(): string {
    return this.value
  }
}
