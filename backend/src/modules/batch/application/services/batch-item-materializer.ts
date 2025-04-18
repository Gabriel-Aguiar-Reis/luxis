import { BatchItemWithResolvedModel } from '@/modules/batch/application/models/batch-item-with-resolved-model.model'
import { RawBatchItem } from '@/modules/batch/application/models/raw-batch-item.model'
import { CategoryRepository } from '@/modules/category/domain/repositories/category.repository'
import { ProductModel } from '@/modules/product-model/domain/entities/product-model.entity'
import { ProductModelRepository } from '@/modules/product-model/domain/repository/product-model.repository'

export class BatchItemMaterializer {
  constructor(
    private readonly productModelRepo: ProductModelRepository,
    private readonly categoryRepo: CategoryRepository
  ) {}

  async materialize(
    batchItem: RawBatchItem
  ): Promise<BatchItemWithResolvedModel> {
    let model = batchItem.modelId
      ? await this.productModelRepo.findById(batchItem.modelId)
      : null

    if (!model && (!batchItem.modelName || !batchItem.categoryId)) {
      throw new Error('Missing model data for new model creation')
    }

    if (!model) {
      // create new model
      model = await this.productModelRepo.create(
        new ProductModel(
          crypto.randomUUID(),
          batchItem.modelName!,
          batchItem.categoryId!,
          batchItem.salePrice
        )
      )
    }

    const category = await this.categoryRepo.findById(model.categoryId)
    if (!category) {
      throw new Error(`Category not found for model ${model.id}`)
    }

    const categoryCode = category.name.getValue().slice(0, 2).toUpperCase()

    return {
      batchItem,
      model,
      categoryCode
    }
  }
}
