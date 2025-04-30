import { UUID } from 'crypto'

export class Inventory {
  constructor(
    public readonly resellerId: UUID,
    private readonly productIds: Set<UUID> = new Set()
  ) {}

  addProduct(productId: UUID): void {
    this.productIds.add(productId)
  }

  removeProduct(productId: UUID): void {
    this.productIds.delete(productId)
  }

  get products(): UUID[] {
    return Array.from(this.productIds)
  }

  hasProduct(productId: UUID): boolean {
    return this.productIds.has(productId)
  }

  get total(): number {
    return this.productIds.size
  }
}
