import { Column, Entity, PrimaryColumn } from 'typeorm'
import { ShipmentStatus } from '@/modules/shipment/domain/enums/shipment-status.enum'
import { UUID } from 'crypto'

@Entity('shipments')
export class ShipmentTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: UUID

  @Column('uuid', { name: 'reseller_id' })
  resellerId: UUID

  @Column('uuid', { array: true, default: [], name: 'product_ids' })
  productIds: UUID[]

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdAt: Date

  @Column('enum', { name: 'status', enum: ShipmentStatus })
  status: ShipmentStatus
}
