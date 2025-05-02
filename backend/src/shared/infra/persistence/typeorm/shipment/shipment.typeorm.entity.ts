import { Column, Entity, PrimaryColumn } from 'typeorm'
import { ShipmentStatus } from '@/modules/shipment/domain/enums/shipment-status.enum'
import { UUID } from 'crypto'

@Entity('shipments')
export class ShipmentTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: UUID

  @Column('uuid')
  resellerId: UUID

  @Column('uuid', { array: true, default: [] })
  productIds: UUID[]

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({
    type: 'enum',
    enum: ShipmentStatus,
    default: ShipmentStatus.PENDING
  })
  status: ShipmentStatus
}
