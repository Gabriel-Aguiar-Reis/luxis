import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { SaleRepository } from '@/modules/sale/domain/repositories/sale.repository'
import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { UUID } from 'crypto'
import { GetOneSaleStrategy } from '@/modules/sale/application/use-cases/get-one/strategies/get-one-sale.strategy'

@Injectable()
export class GetOneSaleAdminOrAssistantStrategy implements GetOneSaleStrategy {
  constructor(
    @Inject('SaleRepository')
    private readonly saleRepository: SaleRepository
  ) {}

  async execute(id: UUID): Promise<Sale> {
    const sale = await this.saleRepository.findById(id)
    if (!sale) {
      throw new NotFoundException('Sale not found')
    }
    return sale
  }
}
