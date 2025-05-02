import { Batch } from '@/modules/batch/domain/entities/batch.entity'
import { BatchItem } from '@/modules/batch/domain/entities/batch-item.entity'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { Unit } from '@/modules/batch/domain/value-objects/unit.vo'
import { UUID } from 'crypto'
import { BatchTypeOrmEntity } from '@/shared/infra/persistence/typeorm/batch/batch.typeorm.entity'
import { BatchItemTypeOrmEntity } from '@/shared/infra/persistence/typeorm/batch/batch-item.typeorm.entity'

export class BatchMapper {
  static toDomain(entity: BatchTypeOrmEntity): Batch {
    const items = entity.items.map((item) =>
      BatchItem.withExistingModel(
        item.id as UUID,
        item.modelId as UUID,
        new Unit(item.quantity),
        new Currency(item.unitCost.toString()),
        new Currency(item.salePrice.toString())
      )
    )
    return new Batch(
      entity.id as UUID,
      entity.arrivalDate,
      entity.supplierId as UUID,
      items
    )
  }

  static toTypeOrm(batch: Batch): BatchTypeOrmEntity {
    const entity = new BatchTypeOrmEntity()
    entity.id = batch.id
    entity.arrivalDate = batch.arrivalDate
    entity.supplierId = batch.supplierId
    entity.items = batch.items.map((item) => {
      const itemEntity = new BatchItemTypeOrmEntity()
      itemEntity.id = item.id
      itemEntity.modelId = item.modelId
      itemEntity.quantity = item.quantity.getValue()
      itemEntity.unitCost = Number(item.unitCost.getValue())
      itemEntity.salePrice = Number(item.salePrice.getValue())
      itemEntity.modelName = item.modelName?.getValue() ?? ''
      itemEntity.categoryId = item.categoryId ?? ('' as UUID)
      return itemEntity
    })
    return entity
  }

  static toResponse(batch: Batch): any {
    return {
      id: batch.id,
      arrivalDate: batch.arrivalDate,
      supplierId: batch.supplierId,
      items: batch.items.map((item) => ({
        id: item.id,
        modelId: item.modelId,
        quantity: item.quantity.getValue(),
        unitCost: item.unitCost.getValue(),
        salePrice: item.salePrice.getValue()
      }))
    }
  }
}
