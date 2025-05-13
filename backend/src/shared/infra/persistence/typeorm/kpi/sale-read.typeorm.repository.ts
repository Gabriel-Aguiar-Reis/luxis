import { SalesByResellerDto } from '@/modules/kpi/application/dtos/sales-by-reseller.dto'
import { TotalSalesByResellerDto } from '@/modules/kpi/application/dtos/total-sales-by-reseller.dto'
import { TotalSalesInPeriodDto } from '@/modules/kpi/application/dtos/total-sales-in-period.dto'
import { SaleReadRepository } from '@/modules/kpi/domain/repositories/sale-read.repository'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { SaleMapper } from '@/shared/infra/persistence/typeorm/sale/mappers/sale.mapper'
import { SaleTypeOrmEntity } from '@/shared/infra/persistence/typeorm/sale/sale.typeorm.entity'
import { UserMapper } from '@/shared/infra/persistence/typeorm/user/mappers/user.mapper'
import { UserTypeOrmEntity } from '@/shared/infra/persistence/typeorm/user/user.typeorm.entity'
import { NotFoundException } from '@nestjs/common'
import { UUID } from 'crypto'
import { Repository } from 'typeorm'

type TotalSalesRawResult = {
  resellerId: string
  resellerName: string
  resellerSurName: string
  salesCount: string
}

export class SaleReadTypeOrmRepository implements SaleReadRepository {
  constructor(
    private readonly saleRepo: Repository<SaleTypeOrmEntity>,
    private readonly userRepo: Repository<UserTypeOrmEntity>
  ) {}

  async totalSalesByReseller(): Promise<TotalSalesByResellerDto[]> {
    const rawResult = await this.saleRepo
      .createQueryBuilder('sale')
      .innerJoin(UserTypeOrmEntity, 'user', 'user.id = sale.resellerId')
      .select('user.id', 'resellerId')
      .addSelect('user.name', 'resellerName')
      .addSelect('user.surName', 'resellerSurName')
      .addSelect('COUNT(sale.id)', 'salesCount')
      .groupBy('user.id')
      .addGroupBy('user.name')
      .addGroupBy('user.surName')
      .getRawMany<TotalSalesRawResult>()

    return rawResult.map((row) => ({
      resellerId: row.resellerId,
      resellerName: `${row.resellerName} ${row.resellerSurName}`,
      salesCount: parseInt(row.salesCount, 10)
    }))
  }

  async salesByResellerId(resellerId: UUID): Promise<SalesByResellerDto> {
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
      resellerId: reseller.id,
      resellerName: `${reseller.name} ${reseller.surName}`,
      sales,
      totalSales: total.toString(),
      salesCount: sales.length
    }
  }

  async totalSalesInPeriod(
    start: Date,
    end: Date
  ): Promise<TotalSalesInPeriodDto> {
    const totalSales = await this.saleRepo
      .createQueryBuilder('sale')
      .where('sale.sale_date BETWEEN :start AND :end', {
        start,
        end
      })
      .getCount()

    return { start, end, totalSales }
  }
  // totalSalesInPeriod(start: Date, end: Date): Promise<Sale[]> {
  //   throw new Error('Method not implemented.')
  // }
  // topSellers(limit: number): Promise<{ resellerId: UUID; total: number }[]> {
  //   throw new Error('Method not implemented.')
  // }
}
