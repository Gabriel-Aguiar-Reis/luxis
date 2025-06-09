import { CustomerPortfolio } from '@/modules/customer-portfolio/domain/entities/customer-portfolio.entity'
import { CustomerPortfolioTypeOrmEntity } from '@/shared/infra/persistence/typeorm/customer-portfolio/customer-portfolio.typeorm.entity'
import { UUID } from 'crypto'

export class CustomerPortfolioMapper {
  static toDomain(entity: CustomerPortfolioTypeOrmEntity): CustomerPortfolio {
    return new CustomerPortfolio(
      entity.id as UUID,
      entity.resellerId as UUID,
      new Set(entity.customerIds as UUID[])
    )
  }

  static toTypeOrm(
    portfolio: CustomerPortfolio
  ): CustomerPortfolioTypeOrmEntity {
    const entity = new CustomerPortfolioTypeOrmEntity()
    entity.id = portfolio.id
    entity.resellerId = portfolio.resellerId
    entity.customerIds = Array.from(portfolio.customers)
    return entity
  }
}
