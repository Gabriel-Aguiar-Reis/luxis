import { ProductModel } from '@/modules/product-model/domain/entities/product-model.entity'
import { ProductModelRepository } from '@/modules/product-model/domain/repositories/product-model.repository'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { Unit } from '@/modules/batch/domain/value-objects/unit.vo'
import { UUID } from 'crypto'
import { ModelName } from '@/modules/product-model/domain/value-objects/model-name.vo'

export class BatchItem {
  private constructor(
    public readonly id: UUID,
    public readonly modelId: UUID,
    public readonly quantity: Unit,
    public readonly unitCost: Currency,
    public readonly salePrice: Currency,
    public readonly modelName?: ModelName,
    public readonly categoryId?: UUID
  ) {}

  static withExistingModel(
    id: UUID,
    modelId: UUID,
    quantity: Unit,
    unitCost: Currency,
    salePrice: Currency
  ): BatchItem {
    return new BatchItem(id, modelId, quantity, unitCost, salePrice)
  }

  static async withNewModel(
    id: UUID,
    modelName: ModelName,
    categoryId: UUID,
    quantity: Unit,
    unitCost: Currency,
    salePrice: Currency,
    modelRepo: ProductModelRepository
  ): Promise<BatchItem> {
    const productModel = await modelRepo.create(
      new ProductModel(crypto.randomUUID(), modelName, categoryId, salePrice)
    )

    return new BatchItem(id, productModel.id, quantity, unitCost, salePrice)
  }
}
