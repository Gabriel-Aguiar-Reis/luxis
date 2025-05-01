import {
  Injectable,
  Inject,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { SaleRepository } from '@/modules/sale/domain/repositories/sale.repository'
import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { UUID } from 'crypto'
import { GetOneSaleStrategy } from '@/modules/sale/application/use-cases/get-one/strategies/get-one-sale.strategy'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'

@Injectable()
export class GetOneSaleResellerStrategy implements GetOneSaleStrategy {
  constructor(
    @Inject('SaleRepository')
    private readonly saleRepository: SaleRepository
  ) {}

  async execute(id: UUID, user: UserPayload): Promise<Sale> {
    const sale = await this.saleRepository.findById(id)
    if (!sale) {
      throw new NotFoundException('Sale not found')
    }

    if (sale.resellerId !== user.id) {
      throw new UnauthorizedException(
        'You are not authorized to view this sale'
      )
    }

    return sale
  }
}
