import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CustomerRepository } from '@/modules/customer/domain/repositories/customer.repository'
import { UUID } from 'crypto'
import { CustomerPortfolioService } from '@/modules/customer-portfolio/application/services/customer-portfolio.service'
import { CustomerDeletedEvent } from '@/modules/customer/domain/events/customer-deleted.event'
import { EventDispatcher } from '@/shared/events/event-dispatcher'

@Injectable()
export class DeleteCustomerUseCase {
  constructor(
    @Inject('CustomerRepository')
    private readonly customerRepository: CustomerRepository,
    @Inject('CustomerPortfolioService')
    private readonly customerPortfolioService: CustomerPortfolioService,
    private readonly eventDispatcher: EventDispatcher
  ) {}

  async execute(id: UUID, fromResellerId: UUID): Promise<void> {
    const customer = await this.customerRepository.findById(id)
    if (!customer) {
      throw new NotFoundException('Customer not found')
    }

    const portfolio =
      await this.customerPortfolioService.getPortfolio(fromResellerId)
    if (!portfolio) {
      throw new NotFoundException('Portfolio not found')
    }

    await this.customerRepository.delete(id)

    await this.eventDispatcher.dispatch(
      new CustomerDeletedEvent(id, fromResellerId)
    )
  }
}
