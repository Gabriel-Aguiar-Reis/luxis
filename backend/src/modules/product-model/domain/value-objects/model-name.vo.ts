import { BadRequestException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

export class ModelName {
  @ApiProperty({
    description: 'The name of the product model',
    example: 'iPhone 13 Pro Max',
    type: String
  })
  private value: string
  constructor(value: string) {
    if (!this.validate(value))
      throw new BadRequestException('Invalid model name format')
    this.value = value
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
