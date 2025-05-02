import { Column, Entity, PrimaryColumn } from 'typeorm'
import { UUID } from 'crypto'

@Entity('sales')
export class SaleTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: UUID

  @Column('uuid')
  resellerId: UUID

  @Column('uuid', { array: true })
  productIds: UUID[]

  @Column('timestamp')
  saleDate: Date

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number
}
