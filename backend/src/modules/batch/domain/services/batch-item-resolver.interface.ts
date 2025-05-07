import { RawBatchItem } from '@/modules/batch/application/models/raw-batch-item.model'
import { BatchItemWithResolvedModel } from '@/modules/batch/application/models/batch-item-with-resolved-model.model'

export interface IBatchItemResolver {
  resolve(batchItem: RawBatchItem): Promise<BatchItemWithResolvedModel>
}
