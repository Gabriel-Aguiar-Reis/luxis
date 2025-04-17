import { OwnershipTransferStatus } from '@/modules/ownership-transfer/domain/enums/ownership-transfer-status.enum'
import { UUID } from 'crypto'

export class OwnershipTransfer {
  constructor(
    public readonly id: UUID,
    public productId: UUID,
    public fromResellerId: UUID,
    public toResellerId: UUID,
    public transferDate: Date,
    public status: OwnershipTransferStatus = OwnershipTransferStatus.PENDING
  ) {}
}
