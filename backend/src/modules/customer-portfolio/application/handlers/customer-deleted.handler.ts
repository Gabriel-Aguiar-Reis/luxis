import { Inject, Injectable } from '@nestjs/common'
import { CustomerDeletedEvent } from '@/modules/customer/domain/events/customer-deleted.event'
import { ICustomerPortfolioService } from '@/modules/customer-portfolio/domain/services/customer-portfolio.interface'
import { EventDispatcher } from '@/shared/events/event-dispatcher'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
@Injectable()
export class CustomerDeletedHandler {
  constructor(
    @Inject('CustomerPortfolioService')
    private readonly customerPortfolioService: ICustomerPortfolioService,
    private readonly eventDispatcher: EventDispatcher,
    private readonly logger: CustomLogger
  ) {
    this.register()
  }

  register() {
    this.eventDispatcher.register(CustomerDeletedEvent, this.handle.bind(this))
  }

  async handle(event: CustomerDeletedEvent): Promise<void> {
    this.logger.warn(
      `Handling customer deleted event for customer ${event.customerId}`,
      'CustomerDeletedHandler'
    )
    await this.customerPortfolioService.removeCustomersFromReseller(
      event.resellerId,
      [event.customerId],
      event.user
    )
  }
}
