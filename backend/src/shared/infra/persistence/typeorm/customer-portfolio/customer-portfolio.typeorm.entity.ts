import { UUID } from 'crypto'
import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity('customer_portfolios')
export class CustomerPortfolioTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: UUID

  @Column('uuid')
  resellerId: UUID

  @Column('uuid', { array: true, default: [] })
  customerIds: UUID[]
}
