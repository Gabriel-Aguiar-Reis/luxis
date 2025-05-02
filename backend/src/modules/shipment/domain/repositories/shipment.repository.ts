import { Shipment } from '@/modules/shipment/domain/entities/shipment.entity'
import { ShipmentStatus } from '@/modules/shipment/domain/enums/shipment-status.enum'
import { UUID } from 'crypto'

export abstract class ShipmentRepository {
  abstract findAll(): Promise<Shipment[]>
  abstract findAllByResellerId(resellerId: UUID): Promise<Shipment[]>
  abstract findById(id: UUID): Promise<Shipment | null>
  abstract create(shipment: Shipment): Promise<Shipment>
  abstract update(shipment: Shipment): Promise<Shipment>
  abstract updateStatus(id: UUID, status: ShipmentStatus): Promise<Shipment>
  abstract delete(id: UUID): Promise<void>
}
