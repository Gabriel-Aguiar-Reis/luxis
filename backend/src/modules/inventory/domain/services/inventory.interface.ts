import { Inventory } from '@/modules/inventory/domain/entities/inventory.entity'
import { UUID } from 'crypto'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'

export interface IInventoryService {
  addProductsToReseller(
    resellerId: UUID,
    productIds: UUID[],
    user: UserPayload
  ): Promise<void>
  removeProductsFromReseller(
    resellerId: UUID,
    productIds: UUID[],
    user: UserPayload
  ): Promise<void>
  getInventory(resellerId: UUID, user: UserPayload): Promise<Inventory | null>
}
