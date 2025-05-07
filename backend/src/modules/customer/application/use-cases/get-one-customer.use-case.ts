import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CustomerRepository } from '@/modules/customer/domain/repositories/customer.repository'
import { Customer } from '@/modules/customer/domain/entities/customer.entity'
import { UUID } from 'crypto'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { CustomerPortfolioService } from '@/modules/customer-portfolio/application/services/customer-portfolio.service'

@Injectable()
export class GetOneCustomerUseCase {
  constructor(
    @Inject('CustomerRepository')
    private readonly customerRepository: CustomerRepository,
    @Inject('CustomerPortfolioService')
    private readonly customerPortfolioService: CustomerPortfolioService
  ) {}

  async execute(id: UUID, user: UserPayload): Promise<Customer> {
    if (user.role === Role.RESELLER) {
      const portfolio = await this.customerPortfolioService.getPortfolio(
        user.id,
        user
      )
      if (!portfolio) {
        throw new NotFoundException('Portfolio not found')
      }

      if (!portfolio.customers.includes(id)) {
        throw new NotFoundException('Customer not found in portfolio')
      }
    }

    const customer = await this.customerRepository.findById(id)
    if (!customer) {
      throw new NotFoundException('Customer not found')
    }
    return customer
  }
}
