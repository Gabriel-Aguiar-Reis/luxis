import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common'
import { UUID } from 'crypto'
import { SaleRepository } from '@/modules/sale/domain/repositories/sale.repository'
import { MarkInstallmentPaidDto } from '@/modules/sale/application/dtos/mark-installment-paid.dto'
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

    const currentPaid = sale.installmentsPaid.getValue()
    const totalInstallments = sale.numberInstallments.getValue()
    const requestedToPay = dto.installmentNumber

    // Validar se não está tentando pagar mais do que o restante
    const remainingInstallments = totalInstallments - currentPaid
    if (requestedToPay > remainingInstallments) {
      throw new BadRequestException(
        `Cannot pay ${requestedToPay} installments. Only ${remainingInstallments} remaining.`
      )
    }

    // Marcar as próximas N parcelas como pagas
    for (let i = 0; i < requestedToPay; i++) {
      const installmentNumber = currentPaid + i + 1
      sale.markInstallmentAsPaid(new Unit(installmentNumber))
    }

    await this.saleRepository.update(sale)
  }
}
