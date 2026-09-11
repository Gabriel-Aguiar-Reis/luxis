import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { CustomerPortfolio } from '@/modules/customer-portfolio/domain/entities/customer-portfolio.entity'
import { CustomerPortfolioTypeOrmEntity } from '@/shared/infra/persistence/typeorm/customer-portfolio/customer-portfolio.typeorm.entity'
import { CustomerPortfolioCustomerTypeOrmEntity } from '@/shared/infra/persistence/typeorm/customer-portfolio/customer-portfolio-customer.typeorm.entity'
import { UUID } from 'crypto'

@Injectable()
export class CustomerPortfolioTypeOrmRepository {
  constructor(
    @InjectRepository(CustomerPortfolioTypeOrmEntity)
    private readonly repository: Repository<CustomerPortfolioTypeOrmEntity>,
    private readonly dataSource: DataSource
  ) {}

  async save(portfolio: CustomerPortfolio): Promise<void> {
    let entity = await this.repository.findOne({ where: { id: portfolio.id } })
    if (!entity) {
      entity = new CustomerPortfolioTypeOrmEntity()
      entity.id = portfolio.id
      entity.resellerId = portfolio.resellerId
    }
    entity.customerIds = portfolio.customers

    await this.dataSource.transaction(async (manager) => {
      await manager.save(CustomerPortfolioTypeOrmEntity, entity)
      await manager.delete(CustomerPortfolioCustomerTypeOrmEntity, {
        portfolioId: portfolio.id
      })
      await manager.save(
        CustomerPortfolioCustomerTypeOrmEntity,
        portfolio.customers.map((customerId) => ({
          portfolioId: portfolio.id,
          customerId
        }))
      )
    })
  }

  async findByResellerId(resellerId: UUID): Promise<CustomerPortfolio | null> {
    const entity = await this.repository.findOne({
      where: { resellerId }
    })

    if (!entity) return null

    const customerIds = await this.findCustomerIdsByPortfolioId(entity.id)

    return new CustomerPortfolio(
      entity.id,
      entity.resellerId,
      new Set(customerIds)
    )
  }

  async deleteByResellerId(resellerId: UUID): Promise<void> {
    const entity = await this.repository.findOne({ where: { resellerId } })
    if (!entity) return

    await this.dataSource.transaction(async (manager) => {
      await manager.delete(CustomerPortfolioCustomerTypeOrmEntity, {
        portfolioId: entity.id
      })
      await manager.delete(CustomerPortfolioTypeOrmEntity, { resellerId })
    })
  }

  private async findCustomerIdsByPortfolioId(
    portfolioId: UUID
  ): Promise<UUID[]> {
    const portfolioCustomerRepository = this.dataSource.getRepository(
      CustomerPortfolioCustomerTypeOrmEntity
    )
    const portfolioCustomers = await portfolioCustomerRepository.find({
      where: { portfolioId },
      order: { assignedAt: 'ASC' }
    })

    return portfolioCustomers.map(
      (portfolioCustomer) => portfolioCustomer.customerId
    )
  }
}
