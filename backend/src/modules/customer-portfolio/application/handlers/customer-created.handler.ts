import { Inject, Injectable } from '@nestjs/common'
import { CustomerCreatedEvent } from '@/modules/customer/domain/events/customer-created.event'
import { ICustomerPortfolioService } from '@/modules/customer-portfolio/domain/services/customer-portfolio.interface'
import { EventDispatcher } from '@/shared/events/event-dispatcher'

@Injectable()
export class CustomerCreatedHandler {
  constructor(
    @Inject('CustomerPortfolioService')
    private readonly customerPortfolioService: ICustomerPortfolioService,
    private readonly eventDispatcher: EventDispatcher
  ) {
    this.register()
  }

  register() {
    this.eventDispatcher.register(CustomerCreatedEvent, this.handle.bind(this))
  }

  async handle(event: CustomerCreatedEvent): Promise<void> {
    await this.customerPortfolioService.addCustomersToReseller(
      event.resellerId,
      [event.customerId]
    )
  }
}
