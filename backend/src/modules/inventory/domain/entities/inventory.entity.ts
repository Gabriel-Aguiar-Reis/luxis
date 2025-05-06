import { UUID } from 'crypto'
import { ApiProperty } from '@nestjs/swagger'

export class Inventory {
  @ApiProperty({
    description: 'The ID of the reseller',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public readonly resellerId: UUID

  @ApiProperty({
    description: 'The IDs of the products in the inventory',
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001'
    ],
    type: [String]
  })
  private readonly productIds: Set<UUID>

  constructor(resellerId: UUID, productIds: Set<UUID> = new Set()) {
    this.resellerId = resellerId
    this.productIds = productIds
  }

  addProduct(productId: UUID): void {
    this.productIds.add(productId)
  }

  removeProduct(productId: UUID): void {
    this.productIds.delete(productId)
  }

  @ApiProperty({
    description: 'The list of product IDs in the inventory',
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001'
    ],
    type: [String]
  })
  get products(): UUID[] {
    return Array.from(this.productIds)
  }

  hasProduct(productId: UUID): boolean {
    return this.productIds.has(productId)
  }

  @ApiProperty({
    description: 'The total number of products in the inventory',
    example: 10,
    type: Number
  })
  get total(): number {
    return this.productIds.size
  }
}
