import { OwnershipTransferStatus } from '@/modules/ownership-transfer/domain/enums/ownership-transfer-status.enum'

export class OwnershipTransferStatusManager {
  private static readonly validTransitions: Record<
    OwnershipTransferStatus,
    OwnershipTransferStatus[]
  > = {
    [OwnershipTransferStatus.PENDING]: [
      OwnershipTransferStatus.APPROVED,
      OwnershipTransferStatus.CANCELLED
    ],
    [OwnershipTransferStatus.APPROVED]: [
      OwnershipTransferStatus.FINISHED,
      OwnershipTransferStatus.CANCELLED
    ],
    [OwnershipTransferStatus.FINISHED]: [],
    [OwnershipTransferStatus.CANCELLED]: []
  }

  static canTransition(
    from: OwnershipTransferStatus,
    to: OwnershipTransferStatus
  ): boolean {
    return this.validTransitions[from]?.includes(to)
  }
}
