import { BadRequestException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

export class Unit {
  @ApiProperty({ description: 'The unit value', type: Number })
  private readonly value: number
  constructor(value: number) {
    if (!this.validate(value))
      throw new BadRequestException('Invalid unit format')
    this.value = value
  }

  private validate(unit: number): boolean {
    return unit === Math.trunc(unit) && unit > -1
  }

  getValue(): number {
    return this.value
  }
}
