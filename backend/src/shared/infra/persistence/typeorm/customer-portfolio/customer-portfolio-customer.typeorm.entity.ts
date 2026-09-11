import { UUID } from 'crypto'
import { Column, Entity, Index, PrimaryColumn } from 'typeorm'

@Entity('customer_portfolio_customers')
@Index('IDX_customer_portfolio_customers_customer_id', ['customerId'])
export class CustomerPortfolioCustomerTypeOrmEntity {
  @PrimaryColumn('uuid', { name: 'portfolio_id' })
  portfolioId: UUID

  @PrimaryColumn('uuid', { name: 'customer_id' })
  customerId: UUID

  @Column('timestamp', { name: 'assigned_at', default: () => 'now()' })
  assignedAt: Date
}
