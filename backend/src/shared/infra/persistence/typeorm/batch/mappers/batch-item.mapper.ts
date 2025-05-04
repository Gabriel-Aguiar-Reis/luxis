import { BatchItem } from '@/modules/batch/domain/entities/batch-item.entity'
import { RawBatchItem } from '@/modules/batch/application/models/raw-batch-item.model'
import { BatchItemWithResolvedModel } from '@/modules/batch/application/models/batch-item-with-resolved-model.model'
import { UUID } from 'crypto'
import { Unit } from '@/shared/common/value-object/unit.vo'
import { Currency } from '@/shared/common/value-object/currency.vo'

interface TypeORMBatchItem {
  id: UUID
  modelId: UUID
  quantity: number
  unitCost: string
  salePrice: string
}

export class BatchItemMapper {
  static toDomain(raw: RawBatchItem): BatchItem {
    if (!raw.modelId) {
      throw new Error('modelId is required to create a BatchItem')
    }

    return BatchItem.withExistingModel(
      raw.id,
      raw.modelId,
      raw.quantity,
      raw.unitCost,
      raw.salePrice
    )
  }

  static toPersistence(batchItem: BatchItem): RawBatchItem {
    return {
      id: batchItem.id,
      modelId: batchItem.modelId,
      quantity: batchItem.quantity,
      unitCost: batchItem.unitCost,
      salePrice: batchItem.salePrice
    }
  }

  static toTypeORM(batchItem: BatchItem): TypeORMBatchItem {
    return {
      id: batchItem.id,
      modelId: batchItem.modelId,
      quantity: batchItem.quantity.getValue(),
      unitCost: batchItem.unitCost.getValue(),
      salePrice: batchItem.salePrice.getValue()
    }
  }

  static fromTypeORM(typeORMItem: TypeORMBatchItem): BatchItem {
    return BatchItem.withExistingModel(
      typeORMItem.id,
      typeORMItem.modelId,
      new Unit(typeORMItem.quantity),
      new Currency(typeORMItem.unitCost),
      new Currency(typeORMItem.salePrice)
    )
  }

  static toResponse(batchItem: BatchItemWithResolvedModel): any {
    return {
      id: batchItem.batchItem.id,
      modelId: batchItem.batchItem.modelId,
      quantity: batchItem.batchItem.quantity.getValue(),
      model: {
        id: batchItem.model.id,
        name: batchItem.model.name.getValue(),
        categoryId: batchItem.model.categoryId,
        suggestedPrice: batchItem.model.suggestedPrice.getValue(),
        description: batchItem.model.description?.getValue()
      },
      categoryCode: batchItem.categoryCode
    }
  }
}
