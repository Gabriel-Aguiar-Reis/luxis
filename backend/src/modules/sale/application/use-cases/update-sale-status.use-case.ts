import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { UUID } from 'crypto'
import { SaleRepository } from '@/modules/sale/domain/repositories/sale.repository'
import { UpdateSaleStatusDto } from '@/modules/sale/application/dtos/update-sale-status.dto'
import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { SaleStatusManager } from '@/modules/sale/domain/services/sale-status-manager.service'
import { BadRequestException } from '@nestjs/common'

@Injectable()
export class UpdateSaleStatusUseCase {
  constructor(
    @Inject('SaleRepository')
    private readonly saleRepository: SaleRepository
  ) {}

  async execute(id: UUID, dto: UpdateSaleStatusDto): Promise<Sale> {
    const sale = await this.saleRepository.findById(id)
    if (!sale) {
      throw new NotFoundException('Sale not found')
    }

    if (!SaleStatusManager.canTransition(sale.status, dto.status)) {
      throw new BadRequestException('Transição de status inválida')
    }
    sale.status = dto.status
    return await this.saleRepository.update(sale)
  }
}
