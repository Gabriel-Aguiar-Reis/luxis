import { BadRequestException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

export class Description {
  @ApiProperty({
    description: 'The description of the product model',
    example: 'Latest iPhone model with advanced features',
    type: String,
    maxLength: 500
  })
  private value: string
  constructor(value: string) {
    const cleaned = value.trim()

    if (cleaned.length > 500) {
      throw new BadRequestException(
        'Description must be 500 characters or less'
      )
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
