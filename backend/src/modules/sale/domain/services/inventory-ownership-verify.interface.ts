import { UUID } from 'crypto'

export interface InventoryOwnershipVerifier {
  verifyOwnership(resellerId: UUID, productIds: UUID[]): Promise<void>
}
