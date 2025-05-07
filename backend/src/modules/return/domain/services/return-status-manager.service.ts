import { ReturnStatus } from '@/modules/return/domain/enums/return-status.enum'

export class ReturnStatusManager {
  private static readonly validTransitions: Record<
    ReturnStatus,
    ReturnStatus[]
  > = {
    [ReturnStatus.PENDING]: [ReturnStatus.APPROVED, ReturnStatus.CANCELLED],
    [ReturnStatus.APPROVED]: [ReturnStatus.RETURNED, ReturnStatus.CANCELLED],
    [ReturnStatus.RETURNED]: [],
    [ReturnStatus.CANCELLED]: []
  }

  static canTransition(from: ReturnStatus, to: ReturnStatus): boolean {
    return this.validTransitions[from]?.includes(to)
  }
}
