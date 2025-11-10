import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException
} from '@nestjs/common'
import { UUID } from 'crypto'
import { SaleRepository } from '@/modules/sale/domain/repositories/sale.repository'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
import { SaleStatus } from '@/modules/sale/domain/enums/sale-status.enum'
import { SaleStatusManager } from '@/modules/sale/domain/services/sale-status-manager.service'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { Unit } from '@/shared/common/value-object/unit.vo'

@Injectable()
export class ConfirmSaleUseCase {
  constructor(
    @Inject('SaleRepository')
    private readonly saleRepository: SaleRepository,
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository
  ) {}

  async execute(id: UUID, user: UserPayload): Promise<void> {
    const sale = await this.saleRepository.findById(id)
    if (!sale) {
      throw new NotFoundException('Sale not found')
    }

    if (user.role === Role.RESELLER && sale.resellerId !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to confirm this sale'
      )
    }

    if (sale.status !== SaleStatus.PENDING) {
      throw new BadRequestException('Sale is not pending')
    }

    const products = await this.productRepository.findManyByIds(sale.productIds)

    // Validar se todos os produtos ainda não foram vendidos
    const allAvailable = products.every(
      (product) => product.status !== ProductStatus.SOLD
    )

    if (!allAvailable) {
      throw new BadRequestException(
        'Some products are already sold and cannot be confirmed in this sale'
      )
    }

    // Validar se a quantidade de produtos encontrados corresponde aos IDs solicitados
    if (products.length !== sale.productIds.length) {
      throw new BadRequestException(
        'Some products were not found or are not available'
      )
    }

    // Determinar o próximo status baseado no tipo de pagamento
    const nextStatus =
      sale.numberInstallments.getValue() === 1
        ? SaleStatus.INSTALLMENTS_PAID
        : SaleStatus.INSTALLMENTS_PENDING

    if (!SaleStatusManager.canTransition(sale.status, nextStatus)) {
      throw new BadRequestException('Transição de status inválida')
    }

    await this.productRepository.updateManyStatus(
      sale.productIds,
      ProductStatus.SOLD
    )

    // Definir status baseado no tipo de pagamento
    if (sale.numberInstallments.getValue() === 1) {
      // Venda à vista - considera como paga imediatamente
      sale.status = SaleStatus.INSTALLMENTS_PAID
      sale.markInstallmentAsPaid(new Unit(1))
    } else {
      // Venda parcelada - aguardando pagamentos
      sale.status = SaleStatus.INSTALLMENTS_PENDING
    }

    await this.saleRepository.update(sale)
  }
}
