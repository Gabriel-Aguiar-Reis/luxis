import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CustomerPortfolio } from '@/modules/customer-portfolio/domain/entities/customer-portfolio.entity'
import { CustomerPortfolioTypeOrmEntity } from '@/shared/infra/persistence/typeorm/customer-portfolio/customer-portfolio.typeorm.entity'
import { UUID } from 'crypto'

@Injectable()
export class CustomerPortfolioTypeOrmRepository {
  constructor(
    @InjectRepository(CustomerPortfolioTypeOrmEntity)
    private readonly repository: Repository<CustomerPortfolioTypeOrmEntity>
  ) {}

  async save(portfolio: CustomerPortfolio): Promise<void> {
    let entity = await this.repository.findOne({ where: { id: portfolio.id } })
    if (!entity) {
      entity = new CustomerPortfolioTypeOrmEntity()
      entity.id = portfolio.id
      entity.resellerId = portfolio.resellerId
    }
    entity.customerIds = portfolio.customers

    await this.repository.save(entity)
  }

  async findByResellerId(resellerId: UUID): Promise<CustomerPortfolio | null> {
    const entity = await this.repository.findOne({
      where: { resellerId }
    })

    if (!entity) return null

    return new CustomerPortfolio(
      entity.id,
      entity.resellerId,
      new Set(entity.customerIds)
    )
  }

  async deleteByResellerId(resellerId: UUID): Promise<void> {
    await this.repository.delete({ resellerId })
  }
}
