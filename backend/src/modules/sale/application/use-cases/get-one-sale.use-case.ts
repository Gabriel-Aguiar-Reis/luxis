import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { SaleRepository } from '@/modules/sale/domain/repositories/sale.repository'
import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { UUID } from 'crypto'

@Injectable()
export class GetOneSaleUseCase {
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
