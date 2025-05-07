import { SaleStatus } from '@/modules/sale/domain/enums/sale-status.enum'

export class SaleStatusManager {
  private static readonly validTransitions: Record<SaleStatus, SaleStatus[]> = {
    [SaleStatus.CONFIRMED]: [
      SaleStatus.INSTALLMENTS_PENDING,
      SaleStatus.CANCELLED
    ],
    [SaleStatus.INSTALLMENTS_PENDING]: [
      SaleStatus.INSTALLMENTS_PAID,
      SaleStatus.INSTALLMENTS_OVERDUE
    ],
    [SaleStatus.INSTALLMENTS_PAID]: [],
    [SaleStatus.INSTALLMENTS_OVERDUE]: [SaleStatus.INSTALLMENTS_PENDING],
    [SaleStatus.CANCELLED]: []
  }

  static canTransition(from: SaleStatus, to: SaleStatus): boolean {
    return this.validTransitions[from]?.includes(to)
  }
}
