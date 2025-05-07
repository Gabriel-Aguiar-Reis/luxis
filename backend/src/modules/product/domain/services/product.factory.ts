import { BatchItem } from '@/modules/batch/domain/entities/batch-item.entity'
import { ProductModel } from '@/modules/product-model/domain/entities/product-model.entity'
import { ModelName } from '@/modules/product-model/domain/value-objects/model-name.vo'
import { Product } from '@/modules/product/domain/entities/product.entity'
import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
import { SerialNumber } from '@/modules/product/domain/value-objects/serial-number.vo'
import { UUID } from 'crypto'

export class ProductFactory {
  static createManyFromBatchItem(
    batchItem: BatchItem,
    model: ProductModel,
    categoryCode: string,
    modelName: ModelName,
    batchDate: Date,
    batchId: UUID,
    batchIndex: number
  ): Product[] {
    const products: Product[] = []

    for (let i = 0; i < batchItem.quantity.getValue(); i++) {
      const serial = SerialNumber.generate(
        batchDate,
        batchIndex,
        categoryCode,
        modelName,
        i
      )

      const product = new Product(
        crypto.randomUUID(),
        serial,
        model.id,
        batchId,
        batchItem.unitCost,
        batchItem.salePrice,
        ProductStatus.IN_STOCK
      )

      products.push(product)
    }

    return products
  }
}
