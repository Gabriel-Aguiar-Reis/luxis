import { ApiProperty } from "@nestjs/swagger"

export class SupplierName {
  @ApiProperty({
    description: 'The name of the supplier',
    example: 'Apple Inc.',
    type: String
  })
  public readonly value: string

  constructor(value: string) {
    if (value.length < 2 || value.length > 100) {
      throw new Error('Supplier name must be between 2 and 100 characters')
    }
    this.value = value
  }

  getValue(): string {
    return this.value
  }
}