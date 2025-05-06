import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { UUID } from 'crypto'
import { SaleRepository } from '@/modules/sale/domain/repositories/sale.repository'
import { MarkInstallmentPaidDto } from '@/modules/sale/presentation/dtos/mark-installment-paid.dto'
import { Unit } from '@/shared/common/value-object/unit.vo'

@Injectable()
export class MarkInstallmentPaidUseCase {
  constructor(
    @Inject('SaleRepository')
    private readonly saleRepository: SaleRepository
  ) {}

  async execute(saleId: UUID, dto: MarkInstallmentPaidDto): Promise<void> {
    const sale = await this.saleRepository.findById(saleId)
    if (!sale) {
      throw new NotFoundException('Sale not found')
    }

    sale.markInstallmentAsPaid(new Unit(dto.installmentNumber))
    await this.saleRepository.update(sale)
  }
}
