import { SaleReturnProductDto } from '@/modules/kpi/application/dtos/sale-return-product.dto'
import { SaleReturnDto } from '@/modules/kpi/application/dtos/sale-return.dto'
import { SalesByResellerDto } from '@/modules/kpi/application/dtos/sales-by-reseller.dto'
import { SalesInPeriodDto } from '@/modules/kpi/application/dtos/sales-in-period.dto'
import { TotalSalesByResellerDto } from '@/modules/kpi/application/dtos/total-sales-by-reseller.dto'
import { TotalSalesInPeriodDto } from '@/modules/kpi/application/dtos/total-sales-in-period.dto'
import { SaleReadRepository } from '@/modules/kpi/domain/repositories/sale-read.repository'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { CustomerTypeOrmEntity } from '@/shared/infra/persistence/typeorm/customer/customer.typeorm.entity'
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

type SaleReturnRawResult = {
  id: UUID
  saleDate: Date
  totalAmount: string
  paymentMethod: string
  numberInstallments: number
  status: string
  productIds: UUID[]
  resellerId: UUID
  resellerName: string
  resellerSurName: string
  resellerPhone: string
  customerId: UUID
  customerName: string
  customerPhone: string
}

export class SaleReadTypeOrmRepository implements SaleReadRepository {
  constructor(
    private readonly saleRepo: Repository<SaleTypeOrmEntity>,
    private readonly userRepo: Repository<UserTypeOrmEntity>
  ) {}

  async SalesInPeriod(start: Date, end: Date): Promise<SalesInPeriodDto> {
    const rawSales = await this.saleRepo
      .createQueryBuilder('sale')
      .innerJoin(UserTypeOrmEntity, 'reseller', 'reseller.id = sale.resellerId')
      .innerJoin(
        CustomerTypeOrmEntity,
        'customer',
        'customer.id = sale.customerId'
      )
      .where('sale.sale_date BETWEEN :start AND :end', { start, end })
      .select([
        'sale.id as id',
        'sale.sale_date as saleDate',
        'sale.total_amount as totalAmount',
        'sale.payment_method as paymentMethod',
        'sale.number_installments as numberInstallments',
        'sale.status as status',
        'sale.product_ids as productIds',

        'reseller.id as resellerId',
        'reseller.name as resellerName',
        'reseller.sur_name as resellerSurName',
        'reseller.phone as resellerPhone',

        'customer.id as customerId',
        'customer.name as customerName',
        'customer.phone as customerPhone'
      ])
      .getRawMany<SaleReturnRawResult>()

    const sales: SaleReturnDto[] = []

    for (const row of rawSales) {
      const productIds: UUID[] = row.productIds

      const productData = await this.saleRepo.manager
        .createQueryBuilder()
        .select([
          'p.id as productId',
          'p.model_id as productModelId',
          'p.sale_price as salePrice',
          'pm.name as productModelName'
        ])
        .from('products', 'p')
        .innerJoin('product_models', 'pm', 'pm.id = p.model_id')
        .where('p.id IN (:...productIds)', { productIds })
        .getRawMany<SaleReturnProductDto>()

      const fullResellerName = `${row.resellerName} ${row.resellerSurName}`

      sales.push({
        id: row.id,
        saleDate: row.saleDate,
        totalAmount: row.totalAmount,
        paymentMethod: row.paymentMethod,
        numberInstallments: row.numberInstallments,
        status: row.status,
        customerId: row.customerId,
        customerName: row.customerName,
        customerPhone: row.customerPhone,
        resellerId: row.resellerId,
        resellerName: fullResellerName,
        resellerPhone: row.resellerPhone,
        products: productData.map((p) => ({
          productId: p.productId,
          productModelId: p.productModelId,
          productModelName: p.productModelName,
          salePrice: p.salePrice
        }))
      })
    }

    return {
      start,
      end,
      sales
    }
  }

  async totalSalesByReseller(): Promise<TotalSalesByResellerDto[]> {
    const rawResult = await this.saleRepo
      .createQueryBuilder('sale')
      .innerJoin(UserTypeOrmEntity, 'user', 'user.id = sale.resellerId')
      .select([
        'user.id as resellerId',
        'user.name as resellerName',
        'user.sur_name as resellerSurName',
        'COUNT(sale.id) as salesCount'
      ])
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
