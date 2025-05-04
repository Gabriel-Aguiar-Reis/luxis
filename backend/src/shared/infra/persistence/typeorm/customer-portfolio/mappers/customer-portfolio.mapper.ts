import { CustomerPortfolio } from '@/modules/customer-portfolio/domain/entities/customer-portfolio.entity'
import { CustomerPortfolioTypeOrmEntity } from '@/shared/infra/persistence/typeorm/customer-portfolio/customer-portfolio.typeorm.entity'

export class CustomerPortfolioMapper {
  static toDomain(entity: CustomerPortfolioTypeOrmEntity): CustomerPortfolio {
    return new CustomerPortfolio(entity.resellerId, new Set(entity.customerIds))
  }

  static toTypeOrm(
    portfolio: CustomerPortfolio
  ): CustomerPortfolioTypeOrmEntity {
    const entity = new CustomerPortfolioTypeOrmEntity()
    entity.resellerId = portfolio.resellerId
    entity.customerIds = Array.from(portfolio.customers)
    return entity
  }
}
