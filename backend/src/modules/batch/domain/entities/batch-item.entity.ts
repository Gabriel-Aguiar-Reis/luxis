import { Currency } from '@/shared/common/value-object/currency.vo'
import { UUID } from 'crypto'

export class BatchItem {
  constructor(
    public readonly id: UUID,
    public modelId: UUID,
    public quantity: number,
    public unitCost: Currency
  ) {}
}
