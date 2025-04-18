import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { SaleRepository } from '@/modules/sale/domain/repositories/sale.repository'
import { CreateSaleDto } from '@/modules/sale/presentation/dtos/create-sale.dto'
import { Injectable, Inject } from '@nestjs/common'

@Injectable()
export class CreateSaleUseCase {
  constructor(
    @Inject('SaleRepository')
    private readonly saleRepository: SaleRepository
  ) {}

  async execute(input: CreateSaleDto): Promise<Sale> {
    const sale = new Sale(
      crypto.randomUUID(),
      input.resellerId,
      input.productIds,
      input.saleDate,
      input.totalAmount
    )

    return this.saleRepository.create(sale)
  }
}
