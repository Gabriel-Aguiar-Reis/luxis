import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { SaleRepository } from '@/modules/sale/domain/repositories/sale.repository'
import { Injectable, Inject } from '@nestjs/common'

@Injectable()
export class GetAllSaleUseCase {
  constructor(
    @Inject('SaleRepository')
    private readonly saleRepository: SaleRepository
  ) {}

  async execute(): Promise<Sale[]> {
    return await this.saleRepository.findAll()
  }
}
