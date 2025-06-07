import { Currency } from '@/shared/common/value-object/currency.vo'
import { UUID } from 'crypto'
import { Unit } from '@/shared/common/value-object/unit.vo'
import { ModelName } from '@/modules/product-model/domain/value-objects/model-name.vo'
import { ImageURL } from '@/modules/product-model/domain/value-objects/image-url.vo'

export class RawBatchItem {
  constructor(
    public readonly id: UUID,
    public readonly quantity: Unit,
    public readonly unitCost: Currency,
    public readonly salePrice: Currency,
    public readonly modelId?: UUID,
    public readonly modelName?: ModelName,
    public readonly categoryId?: UUID,
    public readonly photoUrl?: ImageURL
  ) {}
}
