import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { SaleRepository } from '@/modules/sale/domain/repositories/sale.repository'
import { UpdateSaleDto } from '@/modules/sale/presentation/dtos/update-sale.dto'
import { Injectable, Inject } from '@nestjs/common'
import { UUID } from 'crypto'

@Injectable()
export class UpdateSaleUseCase {
  constructor(
    @Inject('SaleRepository')
    private readonly saleRepository: SaleRepository
  ) {}

  async execute(id: UUID, input: UpdateSaleDto): Promise<Sale> {
    let sale = await this.saleRepository.findById(id)
    if (!sale) {
      throw new Error('Sale not found')
    }
    sale = new Sale(
      id,
      sale.resellerId,
      input.productIds ?? sale.productIds,
      input.saleDate ?? sale.saleDate,
      input.totalAmount ?? sale.totalAmount
    )
    return await this.saleRepository.update(sale)
  }
}
