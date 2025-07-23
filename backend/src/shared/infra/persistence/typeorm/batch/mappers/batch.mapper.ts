import { Batch } from '@/modules/batch/domain/entities/batch.entity'
import { UUID } from 'crypto'
import { BatchTypeOrmEntity } from '@/shared/infra/persistence/typeorm/batch/batch.typeorm.entity'
import { Product } from '@/modules/product/domain/entities/product.entity'

export class BatchMapper {
  static toDomain(entity: BatchTypeOrmEntity): Batch {
    return new Batch(
      entity.id as UUID,
      entity.arrivalDate,
      entity.supplierId as UUID
    )
  }

  static toTypeOrm(batch: Batch): BatchTypeOrmEntity {
    const entity = new BatchTypeOrmEntity()
    entity.id = batch.id
    entity.arrivalDate = batch.arrivalDate
    entity.supplierId = batch.supplierId
    return entity
  }

  static toResponse(batch: Batch, products?: Product[]): any {
    return {
      id: batch.id,
      arrivalDate: batch.arrivalDate,
      supplierId: batch.supplierId,
      products: products?.map((product) => ({
        id: product.id,
        modelId: product.modelId,
        serialNumber: product.serialNumber.getValue(),
        unitCost: product.unitCost.getValue(),
        salePrice: product.salePrice.getValue(),
        status: product.status
      }))
    }
  }
}
