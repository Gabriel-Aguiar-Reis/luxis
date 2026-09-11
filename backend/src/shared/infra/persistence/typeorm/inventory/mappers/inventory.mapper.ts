import { Inventory } from '@/modules/inventory/domain/entities/inventory.entity'
import { InventoryTypeOrmEntity } from '@/shared/infra/persistence/typeorm/inventory/inventory.typeorm.entity'
import { UUID } from 'crypto'

export class InventoryMapper {
  static toDomain(
    entity: InventoryTypeOrmEntity,
    productIds?: UUID[]
  ): Inventory {
    return new Inventory(
      entity.resellerId,
      new Set(productIds ?? entity.productIds)
    )
  }

  static toTypeOrm(inventory: Inventory): InventoryTypeOrmEntity {
    const entity = new InventoryTypeOrmEntity()
    entity.resellerId = inventory.resellerId
    entity.productIds = Array.from(inventory.products)
    return entity
  }
}
