import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { SaleTypeOrmEntity } from '@/shared/infra/persistence/typeorm/sale/sale.typeorm.entity'
import { Unit } from '@/shared/common/value-object/unit.vo'

export class SaleMapper {
  static toDomain(entity: SaleTypeOrmEntity): Sale {
    const sale = new Sale(
      entity.id,
      entity.customerId,
      entity.resellerId,
      entity.productIds,
      entity.saleDate,
      new Currency(entity.totalAmount),
      entity.paymentMethod,
      new Unit(entity.numberInstallments),
      entity.status,
      new Unit(entity.installmentsInterval),
      new Unit(entity.installmentsPaid || 0)
    )

    return sale
  }

  static toTypeOrm(sale: Sale): SaleTypeOrmEntity {
    const entity = new SaleTypeOrmEntity()
    entity.id = sale.id
    entity.customerId = sale.customerId
    entity.resellerId = sale.resellerId
    entity.productIds = sale.productIds
    entity.saleDate = sale.saleDate
    entity.totalAmount = sale.totalAmount.getValue()
    entity.paymentMethod = sale.paymentMethod
    entity.numberInstallments = sale.numberInstallments.getValue()
    entity.status = sale.status
    entity.installmentsInterval = sale.installmentsInterval.getValue()
    entity.installmentsPaid = sale.getInstallments().filter(Boolean).length
    return entity
  }

  static toPersistence(sale: Sale): any {
    return {
      id: sale.id,
      customerId: sale.customerId,
      resellerId: sale.resellerId,
      productIds: sale.productIds,
      saleDate: sale.saleDate,
      totalAmount: sale.totalAmount.getValue(),
      paymentMethod: sale.paymentMethod,
      numberInstallments: sale.numberInstallments.getValue(),
      status: sale.status,
      installmentsInterval: sale.installmentsInterval.getValue(),
      installmentsPaid: sale.getInstallments().filter(Boolean).length
    }
  }

  static toResponse(sale: Sale): any {
    return {
      id: sale.id,
      customerId: sale.customerId,
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
