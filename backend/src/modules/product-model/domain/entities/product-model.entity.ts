import { ModelName } from '@/modules/product-model/domain/value-objects/model-name.vo'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { Description } from '@/shared/common/value-object/description.vo'
import { ImageURL } from '@/modules/product-model/domain/value-objects/image-url.vo'
import { UUID } from 'crypto'

export class ProductModel {
  constructor(
    public readonly id: UUID,
    public name: ModelName,
    public categoryId: UUID,
    public suggestedPrice: Currency,
    public description?: Description,
    public photoUrl?: ImageURL
  ) {}
}
