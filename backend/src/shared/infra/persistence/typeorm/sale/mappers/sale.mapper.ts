import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { SaleTypeOrmEntity } from '@/shared/infra/persistence/typeorm/sale/sale.typeorm.entity'
import { Unit } from '@/shared/common/value-object/unit.vo'

export class SaleMapper {
  static toDomain(entity: SaleTypeOrmEntity): Sale {
    const sale = new Sale(
      entity.id,
      entity.resellerId,
      entity.productIds,
      entity.saleDate,
      new Currency(entity.totalAmount.toString()),
      entity.paymentMethod,
      new Unit(entity.numberInstallments),
      entity.status
    )

    // Restaurar o estado das parcelas
    entity.installments.forEach((paid, index) => {
      if (paid) {
        sale.markInstallmentAsPaid(new Unit(index + 1))
      }
    })

    return sale
  }

  static toTypeOrm(sale: Sale): SaleTypeOrmEntity {
    const entity = new SaleTypeOrmEntity()
    entity.id = sale.id
    entity.resellerId = sale.resellerId
    entity.productIds = sale.productIds
    entity.saleDate = sale.saleDate
    entity.totalAmount = Number(sale.totalAmount.getValue())
    entity.paymentMethod = sale.paymentMethod
    entity.numberInstallments = sale.numberInstallments.getValue()
    entity.status = sale.status
    entity.installmentsInterval = sale.installmentsInterval.getValue()
    return entity
  }

  static toPersistence(sale: Sale): any {
    return {
      id: sale.id,
      resellerId: sale.resellerId,
      productIds: sale.productIds,
      saleDate: sale.saleDate,
      totalAmount: sale.totalAmount.getValue(),
      paymentMethod: sale.paymentMethod,
      numberInstallments: sale.numberInstallments.getValue(),
      status: sale.status,
      installmentsInterval: sale.installmentsInterval.getValue()
    }
  }

  static toResponse(sale: Sale): any {
    return {
      id: sale.id,
      resellerId: sale.resellerId,
      productIds: sale.productIds,
      saleDate: sale.saleDate,
      totalAmount: sale.totalAmount.getValue(),
      paymentMethod: sale.paymentMethod,
      numberInstallments: sale.numberInstallments.getValue(),
      status: sale.status,
      installmentsInterval: sale.installmentsInterval.getValue()
    }
  }
}
