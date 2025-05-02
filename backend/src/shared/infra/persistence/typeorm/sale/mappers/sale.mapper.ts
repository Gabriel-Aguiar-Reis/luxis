import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { SaleTypeOrmEntity } from '@/shared/infra/persistence/typeorm/sale/sale.typeorm.entity'

export class SaleMapper {
  static toDomain(entity: SaleTypeOrmEntity): Sale {
    return new Sale(
      entity.id,
      entity.resellerId,
      entity.productIds,
      entity.saleDate,
      new Currency(entity.totalAmount.toString())
    )
  }

  static toTypeOrm(sale: Sale): SaleTypeOrmEntity {
    const entity = new SaleTypeOrmEntity()
    entity.id = sale.id
    entity.resellerId = sale.resellerId
    entity.productIds = sale.productIds
    entity.saleDate = sale.saleDate
    entity.totalAmount = Number(sale.totalAmount.getValue())
    return entity
  }

  static toPersistence(sale: Sale): any {
    return {
      id: sale.id,
      resellerId: sale.resellerId,
      productIds: sale.productIds,
      saleDate: sale.saleDate,
      totalAmount: sale.totalAmount.getValue()
    }
  }

  static toResponse(sale: Sale): any {
    return {
      id: sale.id,
      resellerId: sale.resellerId,
      productIds: sale.productIds,
      saleDate: sale.saleDate,
      totalAmount: sale.totalAmount.getValue()
    }
  }
}
