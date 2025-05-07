import { UUID } from 'crypto'
import { ApiProperty } from '@nestjs/swagger'

export class CustomerPortfolio {
  @ApiProperty({
    description: 'The ID of the reseller',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public readonly resellerId: UUID

  @ApiProperty({
    description: 'The IDs of the customers in the portfolio',
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001'
    ],
    type: [String]
  })
  private readonly customerIds: Set<UUID>

  constructor(resellerId: UUID, customerIds: Set<UUID> = new Set()) {
    this.resellerId = resellerId
    this.customerIds = customerIds
  }

  addCustomer(customerId: UUID): void {
    this.customerIds.add(customerId)
  }

  removeCustomer(customerId: UUID): void {
    this.customerIds.delete(customerId)
  }

  @ApiProperty({
    description: 'The list of customer IDs in the portfolio',
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001'
    ],
    type: [String]
  })
  get customers(): UUID[] {
    return Array.from(this.customerIds)
  }

  hasCustomer(customerId: UUID): boolean {
    return this.customerIds.has(customerId)
  }

  @ApiProperty({
    description: 'The total number of customers in the portfolio',
    example: 10,
    type: Number
  })
  get total(): number {
    return this.customerIds.size
  }
}
