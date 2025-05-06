import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { UUID } from 'crypto'

export interface IInventoryOwnershipVerifier {
  verifyOwnership(
    resellerId: UUID,
    productIds: UUID[],
    user: UserPayload
  ): Promise<void>
}
