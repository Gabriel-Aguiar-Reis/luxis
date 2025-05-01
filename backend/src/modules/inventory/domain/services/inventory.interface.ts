import { Inventory } from '@/modules/inventory/domain/entities/inventory.entity'
import { UUID } from 'crypto'

export interface IInventoryService {
  addProductsToReseller(resellerId: UUID, productIds: UUID[]): Promise<void>
  removeProductsFromReseller(
    resellerId: UUID,
    productIds: UUID[]
  ): Promise<void>
  getInventory(resellerId: UUID): Promise<Inventory | null>
}
