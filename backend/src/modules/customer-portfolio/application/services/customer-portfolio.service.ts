import { CustomerPortfolio } from '@/modules/customer-portfolio/domain/entities/customer-portfolio.entity'
import { ICustomerPortfolioService } from '@/modules/customer-portfolio/domain/services/customer-portfolio.interface'
import { Injectable, Inject } from '@nestjs/common'
import { UUID } from 'crypto'

@Injectable()
export class CustomerPortfolioService implements ICustomerPortfolioService {
  constructor(
    @Inject('CustomerPortfolioRepository')
    private readonly customerPortfolioRepository: any
  ) {}

  async addCustomersToReseller(
    resellerId: UUID,
    customerIds: UUID[]
  ): Promise<void> {
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
    customerIds: UUID[]
  ): Promise<void> {
    const portfolio =
      await this.customerPortfolioRepository.findByResellerId(resellerId)
    if (!portfolio) return

    for (const id of customerIds) {
      portfolio.removeCustomer(id)
    }

    await this.customerPortfolioRepository.save(portfolio)
  }

  async getPortfolio(resellerId: UUID): Promise<CustomerPortfolio | null> {
    return this.customerPortfolioRepository.findByResellerId(resellerId)
  }
}
