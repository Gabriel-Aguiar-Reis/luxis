import { UUID } from 'crypto'
import { Column, Entity, Index, PrimaryColumn } from 'typeorm'

@Entity('inventory_products')
@Index('IDX_inventory_products_product_id', ['productId'])
export class InventoryProductTypeOrmEntity {
  @PrimaryColumn('uuid', { name: 'reseller_id' })
  resellerId: UUID

  @PrimaryColumn('uuid', { name: 'product_id' })
  productId: UUID

  @Column('timestamp', { name: 'assigned_at', default: () => 'now()' })
  assignedAt: Date
}
