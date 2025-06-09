import { ProductEntryDto } from '@/modules/batch/application/dtos/product-entry-dto'
import { ResolvedProductEntry } from '@/modules/batch/application/models/resolved-product-entry.model'

export interface IProductEntryResolver {
  resolve(batchItem: ProductEntryDto): Promise<ResolvedProductEntry>
}
