import { UUID } from 'crypto'

export interface IInventoryOwnershipVerifier {
  verifyOwnership(resellerId: UUID, productIds: UUID[]): Promise<void>
}
