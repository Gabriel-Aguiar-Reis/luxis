import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { UUID } from 'crypto'
import { SaleRepository } from '@/modules/sale/domain/repositories/sale.repository'
import { SaleStatus } from '@/modules/sale/domain/enums/sale-status.enum'

@Injectable()
export class UpdateSaleStatusUseCase {
  constructor(
    @Inject('SaleRepository')
    private readonly saleRepository: SaleRepository
  ) {}

  async execute(id: UUID, status: SaleStatus): Promise<void> {
    const sale = await this.saleRepository.findById(id)
    if (!sale) {
      throw new NotFoundException('Sale not found')
    }

    sale.status = status
    await this.saleRepository.update(sale)
  }
}
