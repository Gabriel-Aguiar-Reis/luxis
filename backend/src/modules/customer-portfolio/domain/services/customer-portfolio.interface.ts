import { CustomerPortfolio } from '@/modules/customer-portfolio/domain/entities/customer-portfolio.entity'
import { UUID } from 'crypto'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
export interface ICustomerPortfolioService {
  addCustomersToReseller(
    resellerId: UUID,
    customerIds: UUID[],
    user: UserPayload
  ): Promise<void>
  removeCustomersFromReseller(
    resellerId: UUID,
    customerIds: UUID[],
    user: UserPayload
  ): Promise<void>
  getPortfolio(
    resellerId: UUID,
    user: UserPayload
  ): Promise<CustomerPortfolio | null>
}
