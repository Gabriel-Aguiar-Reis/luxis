import { ResolvedProductEntry } from '@/modules/batch/application/models/resolved-product-entry.model'
import { Batch } from '@/modules/batch/domain/entities/batch.entity'
import { Product } from '@/modules/product/domain/entities/product.entity'
import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
import { SerialNumber } from '@/modules/product/domain/value-objects/serial-number.vo'
import { UUID } from 'crypto'

export class BatchFactory {
  static create(
    batchId: UUID,
    arrivalDate: Date,
    supplierId: UUID,
    entries: ResolvedProductEntry[],
    batchIndex: number
  ): { batch: Batch; products: Product[] } {
    const batch = new Batch(batchId, arrivalDate, supplierId)
    const products: Product[] = []

    for (const entry of entries) {
      if (entry.quantity.getValue() <= 0) {
        throw new Error(`Invalid quantity for entry: ${entry.modelId}`)
      }

      for (let i = 0; i < entry.quantity.getValue(); i++) {
        const serial = SerialNumber.generate(
          arrivalDate,
          batchIndex,
          entry.categoryCode,
          entry.modelName,
          i + 1
        )
        const product = new Product(
          crypto.randomUUID(),
          serial,
          entry.modelId,
          batch.id,
          entry.unitCost,
          entry.salePrice,
          ProductStatus.IN_STOCK
        )
        products.push(product)
      }
    }

    return { batch, products }
  }
}
