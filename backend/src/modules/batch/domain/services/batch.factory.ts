import { BatchItemWithResolvedModel } from '@/modules/batch/application/models/batch-item-with-resolved-model.model'
import { BatchItem } from '@/modules/batch/domain/entities/batch-item.entity'
import { Batch } from '@/modules/batch/domain/entities/batch.entity'
import { Product } from '@/modules/product/domain/entities/product.entity'
import { ProductFactory } from '@/modules/product/domain/services/product.factory'
import { UUID } from 'crypto'

export class BatchFactory {
  static async createFromResolvedItems(
    batchId: UUID,
    arrivalDate: Date,
    supplierId: UUID,
    resolvedItems: BatchItemWithResolvedModel[],
    batchIndex: number
  ): Promise<{ batch: Batch; products: Product[] }> {
    const batchItems: BatchItem[] = []
    const products: Product[] = []

    for (const { batchItem, model, categoryCode } of resolvedItems) {
      const item = BatchItem.withExistingModel(
        batchItem.id,
        model.id,
        batchItem.quantity,
        batchItem.unitCost,
        batchItem.salePrice
      )

      batchItems.push(item)

      const createdProducts = ProductFactory.createManyFromBatchItem(
        item,
        model,
        categoryCode,
        model.name,
        arrivalDate,
        batchId,
        batchIndex
      )

      products.push(...createdProducts)
    }

    const batch = new Batch(batchId, arrivalDate, supplierId, batchItems)

    return { batch, products }
  }
}
