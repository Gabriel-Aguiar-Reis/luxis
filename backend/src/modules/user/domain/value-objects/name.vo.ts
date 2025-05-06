import { BadRequestException } from '@nestjs/common'

export class Name {
  constructor(private readonly value: string) {
    if (!this.validate(value))
      throw new BadRequestException('Invalid name format')
  }

  private validate(name: string): boolean {
    return /^([A-Z][a-z]+|de|da|do|dos|das|e)(\s([A-Z][a-z]+|de|da|do|dos|das|e))*$/.test(
      name
    )
  }

  getValue(): string {
    return this.value
  }
}
