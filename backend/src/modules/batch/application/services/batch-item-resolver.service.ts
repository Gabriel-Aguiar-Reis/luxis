import { Inject, Injectable } from '@nestjs/common'
import { ProductModelRepository } from '@/modules/product-model/domain/repository/product-model.repository'
import { CategoryRepository } from '@/modules/category/domain/repositories/category.repository'
import { ProductModel } from '@/modules/product-model/domain/entities/product-model.entity'
import { RawBatchItem } from '@/modules/batch/application/models/raw-batch-item.model'
import { BatchItemWithResolvedModel } from '@/modules/batch/application/models/batch-item-with-resolved-model.model'

@Injectable()
export class BatchItemResolver {
  constructor(
    @Inject('ProductModelRepository')
    private readonly productModelRepo: ProductModelRepository,
    @Inject('CategoryRepository')
    private readonly categoryRepo: CategoryRepository
  ) {}

  async resolve(batchItem: RawBatchItem): Promise<BatchItemWithResolvedModel> {
    let model: ProductModel | null = null

    if (batchItem.modelId) {
      model = await this.productModelRepo.findById(batchItem.modelId)
    }

    if (!model && (!batchItem.modelName || !batchItem.categoryId)) {
      throw new Error(
        'Model name and categoryId are required to create a new model.'
      )
    }

    if (!model) {
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
      throw new Error(`Category not found for model ${model.id}.`)
    }

    const categoryCode = category.name.getValue().slice(0, 2).toUpperCase()

    return {
      batchItem,
      model,
      categoryCode
    }
  }
}
