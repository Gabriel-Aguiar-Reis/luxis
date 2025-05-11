import { SalesByReseller } from '@/modules/kpi/domain/entities/sales-by-reseller.entity'
import { SaleReadRepository } from '@/modules/kpi/domain/repositories/sale-read.repository'
import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { SaleMapper } from '@/shared/infra/persistence/typeorm/sale/mappers/sale.mapper'
import { SaleTypeOrmEntity } from '@/shared/infra/persistence/typeorm/sale/sale.typeorm.entity'
import { UserMapper } from '@/shared/infra/persistence/typeorm/user/mappers/user.mapper'
import { UserTypeOrmEntity } from '@/shared/infra/persistence/typeorm/user/user.typeorm.entity'
import { NotFoundException } from '@nestjs/common'
import { UUID } from 'crypto'
import { Repository } from 'typeorm'

export class SaleReadTypeOrmRepository implements SaleReadRepository {
  constructor(
    private readonly saleRepo: Repository<SaleTypeOrmEntity>,
    private readonly userRepo: Repository<UserTypeOrmEntity>
  ) {}

  async totalSalesByResellerId(resellerId: UUID): Promise<SalesByReseller> {
    const resellerEntity = await this.userRepo.findOne({
      where: { id: resellerId }
    })
    if (!resellerEntity) throw new NotFoundException('Reseller not found')

    const salesEntities = await this.saleRepo
      .createQueryBuilder('sale')
      .where('sale.resellerId = :resellerId', { resellerId })
      .getMany()

    const sumResult = await this.saleRepo
      .createQueryBuilder('sale')
      .select('SUM(sale.totalAmount::float)', 'sum')
      .where('sale.resellerId = :resellerId', { resellerId })
      .getRawOne<{ sum: number }>()

    const reseller = UserMapper.toDomain(resellerEntity)
    const sales = salesEntities.map((s) => SaleMapper.toDomain(s))

    const total = sumResult?.sum || 0
    return {
      reseller,
      sales,
      totalSales: new Currency(total.toFixed(2)),
      salesCount: sales.length
    }
  }
  // totalSalesInPeriod(start: Date, end: Date): Promise<Sale[]> {
  //   throw new Error('Method not implemented.')
  // }
  // topSellers(limit: number): Promise<{ resellerId: UUID; total: number }[]> {
  //   throw new Error('Method not implemented.')
  // }
}
