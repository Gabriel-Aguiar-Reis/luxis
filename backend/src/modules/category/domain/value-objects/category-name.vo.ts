import { BadRequestException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

export class CategoryName {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Smartphones',
    type: String
  })
  private value: string
  constructor(value: string) {
    if (!this.validate(value))
      throw new BadRequestException('Invalid category name format')
    this.value = value
  }

  private validate(name: string): boolean {
    return /^([\p{Lu}][\p{Ll}]+)(\s[\p{Lu}][\p{Ll}]+)*$/u.test(name)
  }

  getValue(): string {
    return this.value
  }
}
