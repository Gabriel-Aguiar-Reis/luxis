import { ShipmentStatus } from '@/modules/shipment/domain/enums/shipment-status.enum'

export class ShipmentStatusManager {
  private static readonly validTransitions: Record<
    ShipmentStatus,
    ShipmentStatus[]
  > = {
    [ShipmentStatus.PENDING]: [
      ShipmentStatus.APPROVED,
      ShipmentStatus.CANCELLED
    ],
    [ShipmentStatus.APPROVED]: [
      ShipmentStatus.DELIVERED,
      ShipmentStatus.CANCELLED
    ],
    [ShipmentStatus.DELIVERED]: [],
    [ShipmentStatus.CANCELLED]: []
  }

  static canTransition(from: ShipmentStatus, to: ShipmentStatus): boolean {
    return this.validTransitions[from]?.includes(to)
  }
}
