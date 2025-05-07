import { Column, Entity, PrimaryColumn } from 'typeorm'
import { UUID } from 'crypto'

@Entity('inventories')
export class InventoryTypeOrmEntity {
  @PrimaryColumn('uuid')
  resellerId: UUID

  @Column('uuid', { array: true, default: [] })
  productIds: UUID[]
}
