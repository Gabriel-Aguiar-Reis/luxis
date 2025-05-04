import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CustomerRepository } from '@/modules/customer/domain/repositories/customer.repository'
import { UpdateCustomerDto } from '@/modules/customer/presentation/dtos/update-customer.dto'
import { Customer } from '@/modules/customer/domain/entities/customer.entity'
import { UUID } from 'crypto'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { CustomerPortfolioService } from '@/modules/customer-portfolio/application/services/customer-portfolio.service'

@Injectable()
export class UpdateCustomerUseCase {
  constructor(
    @Inject('CustomerRepository')
    private readonly customerRepository: CustomerRepository,
    private readonly customerPortfolioService: CustomerPortfolioService
  ) {}

  async execute(
    id: UUID,
    dto: UpdateCustomerDto,
    user: UserPayload
  ): Promise<Customer> {
    const existingCustomer = await this.customerRepository.findById(id)
    if (!existingCustomer) {
      throw new NotFoundException('Customer not found')
    }

    const portfolio = await this.customerPortfolioService.getPortfolio(user.id)
    if (!portfolio) {
      throw new NotFoundException('Portfolio not found')
    }

    if (!portfolio.customers.includes(id)) {
      throw new NotFoundException('Customer not found in portfolio')
    }

    const updatedCustomer = new Customer(
      id,
      dto.name ?? existingCustomer.name,
      dto.phone ?? existingCustomer.phone
    )

    await this.customerRepository.update(updatedCustomer)
    return updatedCustomer
  }
}
