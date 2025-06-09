import { ModelName } from '@/modules/product-model/domain/value-objects/model-name.vo'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { Unit } from '@/shared/common/value-object/unit.vo'
import { UUID } from 'crypto'

export class ResolvedProductEntry {
  constructor(
    public readonly modelId: UUID,
    public readonly modelName: ModelName,
    public readonly categoryCode: string,
    public readonly quantity: Unit,
    public readonly unitCost: Currency,
    public readonly salePrice: Currency
  ) {}
}
