import { Inject, Injectable } from '@nestjs/common'
import { ICustomerPortfolioService } from '@/modules/customer-portfolio/domain/services/customer-portfolio.interface'
import { EventDispatcher } from '@/shared/events/event-dispatcher'
import { CustomerTransferredEvent } from '@/modules/customer/domain/events/customer-transferred.event'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
@Injectable()
export class CustomerTransferredHandler {
  constructor(
    @Inject('CustomerPortfolioService')
    private readonly customerPortfolioService: ICustomerPortfolioService,
    private readonly eventDispatcher: EventDispatcher,
    private readonly logger: CustomLogger
  ) {
    this.register()
  }

  register() {
    this.eventDispatcher.register(
      CustomerTransferredEvent,
      this.handle.bind(this)
    )
  }

  async handle(event: CustomerTransferredEvent): Promise<void> {
    this.logger.warn(
      `Handling customer transferred event for customer ${event.customerId}`,
      'CustomerTransferredHandler'
    )
    await this.customerPortfolioService.removeCustomersFromReseller(
      event.fromResellerId,
      [event.customerId],
      event.user
    )
    await this.customerPortfolioService.addCustomersToReseller(
      event.toResellerId,
      [event.customerId],
      event.user
    )
  }
}
