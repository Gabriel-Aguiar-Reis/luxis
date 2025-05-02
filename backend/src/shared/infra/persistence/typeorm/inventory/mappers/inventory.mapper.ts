import { Inventory } from '@/modules/inventory/domain/entities/inventory.entity'
import { InventoryTypeOrmEntity } from '@/shared/infra/persistence/typeorm/inventory/inventory.typeorm.entity'

export class InventoryMapper {
  static toDomain(entity: InventoryTypeOrmEntity): Inventory {
    return new Inventory(entity.resellerId, new Set(entity.productIds))
  }

  static toTypeOrm(inventory: Inventory): InventoryTypeOrmEntity {
    const entity = new InventoryTypeOrmEntity()
    entity.resellerId = inventory.resellerId
    entity.productIds = Array.from(inventory.products)
    return entity
  }
}
