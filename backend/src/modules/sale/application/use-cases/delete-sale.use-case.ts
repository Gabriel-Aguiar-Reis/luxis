import { SaleRepository } from '@/modules/sale/domain/repositories/sale.repository'
import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { UUID } from 'crypto'

@Injectable()
export class DeleteSaleUseCase {
  constructor(
    @Inject('SaleRepository')
    private readonly saleRepository: SaleRepository
  ) {}

  async execute(id: UUID): Promise<void> {
    const sale = await this.saleRepository.findById(id)
    if (!sale) {
      throw new NotFoundException('Sale not found')
    }
    return await this.saleRepository.delete(id)
  }
}
