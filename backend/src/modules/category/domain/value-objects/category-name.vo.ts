export class CategoryName {
  constructor(private readonly value: string) {
    if (!this.validate(value)) throw new Error('Invalid category name format')
  }

  private validate(name: string): boolean {
    return /^([A-Z][a-z])(\s([A-Z][a-z]))*$/.test(name)
  }

  getValue(): string {
    return this.value
  }
}
