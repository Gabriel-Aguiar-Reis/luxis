import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException
} from '@nestjs/common'
import { UUID } from 'crypto'
import { CustomerRepository } from '@/modules/customer/domain/repositories/customer.repository'
import { EventDispatcher } from '@/shared/events/event-dispatcher'
import { CustomerTransferredEvent } from '@/modules/customer/domain/events/customer-transferred.event'
import { ICustomerPortfolioService } from '@/modules/customer-portfolio/domain/services/customer-portfolio.interface'
import { TransferCustomerDto } from '@/modules/customer/application/dtos/transfer-customer.dto'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Role } from '@/modules/user/domain/enums/user-role.enum'

@Injectable()
export class TransferCustomerUseCase {
  constructor(
    @Inject('CustomerRepository')
    private readonly customerRepository: CustomerRepository,
    private readonly eventDispatcher: EventDispatcher,
    @Inject('CustomerPortfolioService')
    private readonly customerPortfolioService: ICustomerPortfolioService
  ) {}

  async execute(
    customerId: UUID,
    dto: TransferCustomerDto,
    user: UserPayload
  ): Promise<void> {
    if (user.role !== Role.RESELLER) {
      throw new ForbiddenException(
        'You are not allowed to transfer this customer'
      )
    }
    const customer = await this.customerRepository.findById(customerId)
    if (!customer) {
      throw new NotFoundException('Customer not found')
    }

    const giverPortfolio = await this.customerPortfolioService.getPortfolio(
      dto.fromResellerId,
      user
    )
    if (!giverPortfolio) {
      throw new NotFoundException('Giver portfolio not found')
    }

    if (!giverPortfolio.hasCustomer(customerId)) {
      throw new NotFoundException('Customer not found in giver portfolio')
    }

    const takerPortfolio = await this.customerPortfolioService.getPortfolio(
      dto.toResellerId,
      user
    )
    if (!takerPortfolio) {
      throw new NotFoundException('Taker portfolio not found')
    }

    await this.eventDispatcher.dispatch(
      new CustomerTransferredEvent(
        customerId,
        dto.fromResellerId,
        dto.toResellerId,
        user
      )
    )
  }
}
