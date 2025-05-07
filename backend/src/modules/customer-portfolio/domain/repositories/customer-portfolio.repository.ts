import { CustomerPortfolio } from '@/modules/customer-portfolio/domain/entities/customer-portfolio.entity'
import { UUID } from 'crypto'

export interface CustomerPortfolioRepository {
  findByResellerId(resellerId: UUID): Promise<CustomerPortfolio | null>
  save(portfolio: CustomerPortfolio): Promise<void>
}
