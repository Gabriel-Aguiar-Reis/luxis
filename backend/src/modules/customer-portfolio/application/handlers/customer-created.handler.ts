import { Inject, Injectable } from '@nestjs/common'
import { CustomerCreatedEvent } from '@/modules/customer/domain/events/customer-created.event'
import { ICustomerPortfolioService } from '@/modules/customer-portfolio/domain/services/customer-portfolio.interface'
import { EventDispatcher } from '@/shared/events/event-dispatcher'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
@Injectable()
export class CustomerCreatedHandler {
  constructor(
    @Inject('CustomerPortfolioService')
    private readonly customerPortfolioService: ICustomerPortfolioService,
    private readonly eventDispatcher: EventDispatcher,
    private readonly logger: CustomLogger
  ) {
    this.register()
  }

  register() {
    this.eventDispatcher.register(CustomerCreatedEvent, this.handle.bind(this))
  }

  async handle(event: CustomerCreatedEvent): Promise<void> {
    this.logger.warn(
      `Handling customer created event for customer ${event.customerId}`,
      'CustomerCreatedHandler'
    )
    await this.customerPortfolioService.addCustomersToReseller(
      event.resellerId,
      [event.customerId],
      event.user
    )
  }
}
