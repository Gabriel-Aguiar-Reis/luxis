import { UUID } from 'crypto'
import { Currency } from '@/shared/common/value-object/currency.vo'

export interface ISalePriceCalculator {
  calculateTotal(productIds: UUID[]): Promise<Currency>
}
