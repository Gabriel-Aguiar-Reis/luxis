import { CustomerPortfolio } from '@/modules/customer-portfolio/domain/entities/customer-portfolio.entity'
import { UUID } from 'crypto'

export interface ICustomerPortfolioService {
  addCustomersToReseller(resellerId: UUID, customerIds: UUID[]): Promise<void>
  removeCustomersFromReseller(
    resellerId: UUID,
    customerIds: UUID[]
  ): Promise<void>
  getPortfolio(resellerId: UUID): Promise<CustomerPortfolio | null>
}
