import { UUID } from 'crypto'

export class CustomerPortfolio {
  constructor(
    public readonly resellerId: UUID,
    private readonly customerIds: Set<UUID> = new Set()
  ) {}

  addCustomer(customerId: UUID): void {
    this.customerIds.add(customerId)
  }

  removeCustomer(customerId: UUID): void {
    this.customerIds.delete(customerId)
  }

  get customers(): UUID[] {
    return Array.from(this.customerIds)
  }

  hasCustomer(customerId: UUID): boolean {
    return this.customerIds.has(customerId)
  }

  get total(): number {
    return this.customerIds.size
  }
}
