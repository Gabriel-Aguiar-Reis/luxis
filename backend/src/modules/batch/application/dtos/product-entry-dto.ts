import { ImageURL } from '@/modules/product-model/domain/value-objects/image-url.vo'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { UUID } from 'crypto'

export class ProductEntryDto {
  modelId?: UUID
  modelName?: string
  categoryId?: UUID
  quantity: number
  unitCost: Currency
  salePrice: Currency
  photoUrl?: ImageURL
}
