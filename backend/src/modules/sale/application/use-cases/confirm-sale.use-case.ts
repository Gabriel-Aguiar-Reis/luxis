import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException
} from '@nestjs/common'
import { UUID } from 'crypto'
import { DataSource, In } from 'typeorm'
import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
import { SaleStatus } from '@/modules/sale/domain/enums/sale-status.enum'
import { SaleStatusManager } from '@/modules/sale/domain/services/sale-status-manager.service'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { Unit } from '@/shared/common/value-object/unit.vo'
import { SaleTypeOrmEntity } from '@/shared/infra/persistence/typeorm/sale/sale.typeorm.entity'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { SaleMapper } from '@/shared/infra/persistence/typeorm/sale/mappers/sale.mapper'

@Injectable()
export class ConfirmSaleUseCase {
  constructor(
    @Inject('DataSource')
    private readonly dataSource: DataSource
  ) {}

  async execute(id: UUID, user: UserPayload): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const saleEntity = await manager
        .getRepository(SaleTypeOrmEntity)
        .findOne({
          where: { id },
          lock: { mode: 'pessimistic_write' }
        })

      if (!saleEntity) {
        throw new NotFoundException('Sale not found')
      }

      const sale = SaleMapper.toDomain(saleEntity)

      if (user.role === Role.RESELLER && sale.resellerId !== user.id) {
        throw new ForbiddenException(
          'You are not authorized to confirm this sale'
        )
      }

      if (sale.status !== SaleStatus.PENDING) {
        throw new BadRequestException('Sale is not pending')
      }

      const productRepository = manager.getRepository(ProductTypeOrmEntity)
      const productEntities = await productRepository.find({
        where: { id: In(sale.productIds) },
        lock: { mode: 'pessimistic_write' }
      })

      const allAvailable = productEntities.every(
        (product) => product.status !== ProductStatus.SOLD
      )

      if (!allAvailable) {
        throw new BadRequestException(
          'Some products are already sold and cannot be confirmed in this sale'
        )
      }

      if (productEntities.length !== sale.productIds.length) {
        throw new BadRequestException(
          'Some products were not found or are not available'
        )
      }

      const nextStatus =
        sale.numberInstallments.getValue() === 1
          ? SaleStatus.INSTALLMENTS_PAID
          : SaleStatus.INSTALLMENTS_PENDING

      if (!SaleStatusManager.canTransition(sale.status, nextStatus)) {
        throw new BadRequestException('Transição de status inválida')
      }

      await productRepository.update(
        { id: In(sale.productIds) },
        { status: ProductStatus.SOLD }
      )

      if (sale.numberInstallments.getValue() === 1) {
        sale.status = SaleStatus.INSTALLMENTS_PAID
        sale.markInstallmentAsPaid(new Unit(1))
      } else {
        sale.status = SaleStatus.INSTALLMENTS_PENDING
      }

      await manager.save(SaleTypeOrmEntity, SaleMapper.toTypeOrm(sale))
    })
  }
}
