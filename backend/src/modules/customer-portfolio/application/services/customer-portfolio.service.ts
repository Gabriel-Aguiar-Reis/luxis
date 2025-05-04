import { CustomerPortfolio } from '@/modules/customer-portfolio/domain/entities/customer-portfolio.entity'
import { ICustomerPortfolioService } from '@/modules/customer-portfolio/domain/services/customer-portfolio.interface'
import { Injectable, Inject } from '@nestjs/common'
import { UUID } from 'crypto'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { CustomerPortfolioRepository } from '@/modules/customer-portfolio/domain/repositories/customer-portfolio.repository'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
@Injectable()
export class CustomerPortfolioService implements ICustomerPortfolioService {
  constructor(
    @Inject('CustomerPortfolioRepository')
    private readonly customerPortfolioRepository: CustomerPortfolioRepository,
    private readonly logger: CustomLogger
  ) {}

  async addCustomersToReseller(
    resellerId: UUID,
    customerIds: UUID[],
    user: UserPayload
  ): Promise<void> {
    this.logger.warn(
      `Adding customers to reseller ${resellerId} - Requested by user ${user.email}`,
      'CustomerPortfolioService'
    )
    let portfolio =
      await this.customerPortfolioRepository.findByResellerId(resellerId)

    if (!portfolio) {
      portfolio = new CustomerPortfolio(resellerId)
    }

    for (const id of customerIds) {
      portfolio.addCustomer(id)
    }

    await this.customerPortfolioRepository.save(portfolio)
  }

  async removeCustomersFromReseller(
    resellerId: UUID,
    customerIds: UUID[],
    user: UserPayload
  ): Promise<void> {
    this.logger.warn(
      `Removing customers from reseller ${resellerId} - Requested by user ${user.email}`,
      'CustomerPortfolioService'
    )
    const portfolio =
      await this.customerPortfolioRepository.findByResellerId(resellerId)
    if (!portfolio) {
      this.logger.warn(
        `Portfolio not found for reseller ${resellerId}`,
        'CustomerPortfolioService'
      )
      return
    }

    for (const id of customerIds) {
      portfolio.removeCustomer(id)
    }

    await this.customerPortfolioRepository.save(portfolio)
  }

  async getPortfolio(
    resellerId: UUID,
    user: UserPayload
  ): Promise<CustomerPortfolio | null> {
    this.logger.log(
      `Getting portfolio for reseller ${resellerId} - Requested by user ${user.email}`,
      'CustomerPortfolioService'
    )
    return this.customerPortfolioRepository.findByResellerId(resellerId)
  }
}
