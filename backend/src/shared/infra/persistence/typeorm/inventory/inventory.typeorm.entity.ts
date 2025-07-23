import { Column, Entity, PrimaryColumn } from 'typeorm'
import { UUID } from 'crypto'

@Entity('inventories')
export class InventoryTypeOrmEntity {
  @PrimaryColumn('uuid', { name: 'reseller_id' })
  resellerId: UUID

  @Column('uuid', { array: true, default: [], name: 'product_ids' })
  productIds: UUID[]
}
