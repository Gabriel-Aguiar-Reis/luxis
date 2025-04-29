import { ShipmentStatus } from '@/modules/shipment/domain/enums/shipment-status.enum'
import { UUID } from 'crypto'

export class Shipment {
  constructor(
    public readonly id: UUID,
    public resellerId: UUID,
    public readonly createdAt: Date,
    public status: ShipmentStatus = ShipmentStatus.PENDING,
    public productIds: UUID[] = []
  ) {}
}
