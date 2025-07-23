import { BadRequestException } from '@nestjs/common'

export class Unit {
  constructor(private readonly value: number) {
    if (!this.validate(value))
      throw new BadRequestException('Invalid unit format')
  }

  private validate(unit: number): boolean {
    return unit === Math.trunc(unit) && unit > -1
  }

  getValue(): number {
    return this.value
  }
}
