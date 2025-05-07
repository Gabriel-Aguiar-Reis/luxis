import { UUID } from 'crypto'
import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity('customer_portfolios')
export class CustomerPortfolioTypeOrmEntity {
  @PrimaryColumn('uuid')
  resellerId: UUID

  @Column('jsonb', { default: '[]' })
  customerIds: UUID[]
}
