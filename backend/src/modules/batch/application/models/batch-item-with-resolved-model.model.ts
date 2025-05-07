import { RawBatchItem } from '@/modules/batch/application/models/raw-batch-item.model'
import { ProductModel } from '@/modules/product-model/domain/entities/product-model.entity'

export class BatchItemWithResolvedModel {
  constructor(
    public readonly batchItem: RawBatchItem,
    public readonly model: ProductModel,
    public readonly categoryCode: string
  ) {}
}
