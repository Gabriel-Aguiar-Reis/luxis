import { CreateCustomerDto } from '@/modules/customer/presentation/dtos/create-customer.dto'
import { Customer } from '@/modules/customer/domain/entities/customer.entity'
import { Inject, Injectable } from '@nestjs/common'
import { CustomerPortfolio } from '@/modules/customer-portfolio/domain/entities/customer-portfolio.entity'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { CustomerPortfolioService } from '@/modules/customer-portfolio/application/services/customer-portfolio.service'
import { EventDispatcher } from '@/shared/events/event-dispatcher'
import { CustomerCreatedEvent } from '@/modules/customer/domain/events/customer-created.event'

@Injectable()
export class CreateCustomerUseCase {
  constructor(
    @Inject('CustomerPortfolioService')
    private readonly customerPortfolioService: CustomerPortfolioService,
    private readonly eventDispatcher: EventDispatcher
  ) {}

  async execute(dto: CreateCustomerDto, user: UserPayload): Promise<Customer> {
    const customer = new Customer(crypto.randomUUID(), dto.name, dto.phone)
    let portfolio = await this.customerPortfolioService.getPortfolio(user.id)
    if (!portfolio) {
      portfolio = new CustomerPortfolio(user.id)
    }

    await this.eventDispatcher.dispatch(
      new CustomerCreatedEvent(customer.id, user.id)
    )

    portfolio.addCustomer(customer.id)

    return customer
  }
}
