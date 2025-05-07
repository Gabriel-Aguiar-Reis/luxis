import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CustomerRepository } from '@/modules/customer/domain/repositories/customer.repository'
import { Customer } from '@/modules/customer/domain/entities/customer.entity'
import { CustomerPortfolioService } from '@/modules/customer-portfolio/application/services/customer-portfolio.service'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Role } from '@/modules/user/domain/enums/user-role.enum'

@Injectable()
export class GetAllCustomerUseCase {
  constructor(
    @Inject('CustomerRepository')
    private readonly customerRepository: CustomerRepository,
    @Inject('CustomerPortfolioService')
    private readonly customerPortfolioService: CustomerPortfolioService
  ) {}

  async execute(user: UserPayload): Promise<Customer[]> {
    if (user.role === Role.RESELLER) {
      const portfolio = await this.customerPortfolioService.getPortfolio(
        user.id,
        user
      )
      if (!portfolio) {
        throw new NotFoundException('Portfolio not found')
      }

      return await this.customerRepository.findAllByIds(portfolio.customers)
    }

    return await this.customerRepository.findAll()
  }
}
