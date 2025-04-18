export class ModelName {
  constructor(private readonly value: string) {
    if (!this.validate(value)) throw new Error('Invalid model name format')
  }

  private validate(name: string): boolean {
    return /^([A-Z][a-z]+|de|e|com|sem)(\s([A-Z][a-z]+|de|e|com|sem))*$/.test(
      name
    )
  }

  getValue(): string {
    return this.value
  }
}
