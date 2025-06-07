import { BadRequestException } from '@nestjs/common'

export class ModelName {
  constructor(private readonly value: string) {
    if (!this.validate(value))
      throw new BadRequestException('Invalid model name format')
  }

  private validate(name: string): boolean {
    return /^(?:[\p{L}\d]+(?:-[\p{L}\d]+)*|de|e|com|sem)(?: (?:[\p{L}\d]+(?:-[\p{L}\d]+)*|de|e|com|sem))*$/u.test(
      name
    )
  }

  getValue(): string {
    return this.value
  }
}
