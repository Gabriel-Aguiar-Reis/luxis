export class Unit {
  constructor(private readonly value: number) {
    if (!this.validate(value)) throw new Error('Invalid unit format')
  }

  private validate(unit: number): boolean {
    return unit === Math.trunc(unit) && unit > 0
  }

  getValue(): number {
    return this.value
  }
}
