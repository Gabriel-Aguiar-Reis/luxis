import { CreateCustomerDto } from '@/modules/customer/application/dtos/create-customer.dto'
import { Customer } from '@/modules/customer/domain/entities/customer.entity'
import { Inject, Injectable } from '@nestjs/common'
import { CustomerPortfolio } from '@/modules/customer-portfolio/domain/entities/customer-portfolio.entity'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { CustomerPortfolioService } from '@/modules/customer-portfolio/application/services/customer-portfolio.service'
import { EventDispatcher } from '@/shared/events/event-dispatcher'
import { CustomerCreatedEvent } from '@/modules/customer/domain/events/customer-created.event'
import { Name } from '@/modules/user/domain/value-objects/name.vo'
import { PhoneNumber } from '@/modules/user/domain/value-objects/phone-number.vo'
import { CustomerRepository } from '@/modules/customer/domain/repositories/customer.repository'

@Injectable()
export class CreateCustomerUseCase {
  constructor(
    @Inject('CustomerPortfolioService')
    private readonly customerPortfolioService: CustomerPortfolioService,
    private readonly eventDispatcher: EventDispatcher,
    @Inject('CustomerRepository')
    private readonly customerRepository: CustomerRepository
  ) {}

  async execute(dto: CreateCustomerDto, user: UserPayload): Promise<Customer> {
    const customer = new Customer(
      crypto.randomUUID(),
      new Name(dto.name),
      new PhoneNumber(dto.phone)
    )

    await this.customerRepository.create(customer)

    let portfolio = await this.customerPortfolioService.getPortfolio(
      user.id,
      user
    )
    if (!portfolio) {
      portfolio = new CustomerPortfolio(crypto.randomUUID(), user.id)
    }
    portfolio.addCustomer(customer.id)
    await this.customerPortfolioService['customerPortfolioRepository'].save(
      portfolio
    )
    await this.eventDispatcher.dispatch(
      new CustomerCreatedEvent(customer.id, user.id, user)
    )

    return customer
  }
}
