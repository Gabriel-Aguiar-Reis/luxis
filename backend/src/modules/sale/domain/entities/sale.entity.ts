import { Currency } from '@/shared/common/value-object/currency.vo'
import { UUID } from 'crypto'

export class Sale {
  constructor(
    public readonly id: UUID,
    public resellerId: UUID,
    public productIds: UUID[] = [],
    public saleDate: Date,
    public totalAmount: Currency
  ) {}
}
