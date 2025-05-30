import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CustomerRepository } from '@/modules/customer/domain/repositories/customer.repository'
import { UpdateCustomerDto } from '@/modules/customer/application/dtos/update-customer.dto'
import { Customer } from '@/modules/customer/domain/entities/customer.entity'
import { UUID } from 'crypto'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { CustomerPortfolioService } from '@/modules/customer-portfolio/application/services/customer-portfolio.service'
import { PhoneNumber } from '@/modules/user/domain/value-objects/phone-number.vo'
import { Name } from '@/modules/user/domain/value-objects/name.vo'

@Injectable()
export class UpdateCustomerUseCase {
  constructor(
    @Inject('CustomerRepository')
    private readonly customerRepository: CustomerRepository,
    @Inject('CustomerPortfolioService')
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

    const updatedCustomer = new Customer(
      id,
      dto.name ? new Name(dto.name) : existingCustomer.name,
      dto.phone ? new PhoneNumber(dto.phone) : existingCustomer.phone
    )

    await this.customerRepository.update(updatedCustomer)
    return updatedCustomer
  }
}
