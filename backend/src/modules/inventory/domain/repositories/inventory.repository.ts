import { Inventory } from '@/modules/inventory/domain/entities/inventory.entity'
import { UUID } from 'crypto'

export interface InventoryRepository {
  findByResellerId(resellerId: UUID): Promise<Inventory | null>
  save(inventory: Inventory): Promise<void>
}
