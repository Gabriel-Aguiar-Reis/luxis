import { SaleReturnProductDto } from '@/modules/kpi/admin/application/dtos/sale/sale-return-product.dto'
import { SaleReturnDto } from '@/modules/kpi/admin/application/dtos/sale/sale-return.dto'
import { SalesByResellerDto } from '@/modules/kpi/admin/application/dtos/sale/sales-by-reseller.dto'
import { SalesInPeriodDto } from '@/modules/kpi/admin/application/dtos/sale/sales-in-period.dto'
import { TotalSalesByResellerDto } from '@/modules/kpi/admin/application/dtos/sale/total-sales-by-reseller.dto'
import { TotalSalesInPeriodDto } from '@/modules/kpi/admin/application/dtos/sale/total-sales-in-period.dto'
import { SaleReadRepository } from '@/modules/kpi/admin/domain/repositories/sale-read.repository'
import { CustomerTypeOrmEntity } from '@/shared/infra/persistence/typeorm/customer/customer.typeorm.entity'
import { ProductModelTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.entity'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { SaleMapper } from '@/shared/infra/persistence/typeorm/sale/mappers/sale.mapper'
import { SaleTypeOrmEntity } from '@/shared/infra/persistence/typeorm/sale/sale.typeorm.entity'
import { UserMapper } from '@/shared/infra/persistence/typeorm/user/mappers/user.mapper'
import { UserTypeOrmEntity } from '@/shared/infra/persistence/typeorm/user/user.typeorm.entity'
import { NotFoundException } from '@nestjs/common'
import { UUID } from 'crypto'
import { Repository, SelectQueryBuilder } from 'typeorm'

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
  resellerPhone: string
  customerId: UUID
  customerName: string
  customerPhone: string
}

function baseWhere(
  qb: SelectQueryBuilder<SaleTypeOrmEntity>,
  start?: Date,
  end?: Date
) {
  if (start) {
    qb.andWhere('sale.sale_date >= :start', { start })
  }

  if (end) {
    qb.andWhere('sale.sale_date <= :end', { end })
  }

  return qb
}

export class SaleReadTypeOrmRepository implements SaleReadRepository {
  constructor(
    private readonly saleRepo: Repository<SaleTypeOrmEntity>,
    private readonly userRepo: Repository<UserTypeOrmEntity>,
    private readonly productRepo: Repository<ProductTypeOrmEntity>
  ) {}

  async salesByResellerId(
    resellerId: UUID,
    start?: Date,
    end?: Date
  ): Promise<SalesByResellerDto> {
    const resellerEntity = await this.userRepo.findOne({
      where: { id: resellerId }
    })
    if (!resellerEntity) throw new NotFoundException('Reseller not found')

    const salesEntities = await baseWhere(
      this.saleRepo
        .createQueryBuilder('sale')
        .where('sale.reseller_id = :resellerId', { resellerId }),
      start,
      end
    ).getMany()

    const sumResult = await baseWhere(
      this.saleRepo
        .createQueryBuilder('sale')
        .select('SUM(sale.totalAmount::float)', 'sum')
    ).getRawOne<{ sum: string }>()

    const reseller = UserMapper.toDomain(resellerEntity)
    const sales = salesEntities.map((s) => SaleMapper.toDomain(s))

    const total = Number(sumResult?.sum ?? 0)

    return {
      resellerId: reseller.id,
      resellerName: `${reseller.name} ${reseller.surName}`,
      sales,
      totalSales: total.toFixed(2),
      salesCount: sales.length
    }
  }

  async totalSalesByResellerId(
    resellerId: UUID,
    start?: Date,
    end?: Date
  ): Promise<TotalSalesByResellerDto> {
    throw new Error('Method not implemented.')
  }

  async salesByReseller(
    start?: Date,
    end?: Date
  ): Promise<SalesByResellerDto[]> {
    throw new Error('Method not implemented.')
  }

  async totalSalesByReseller(
    start?: Date,
    end?: Date
  ): Promise<TotalSalesByResellerDto[]> {
    const rawResult = await this.saleRepo
      .createQueryBuilder('sale')
      .innerJoin(UserTypeOrmEntity, 'user', 'user.id = sale.resellerId')
      .select([
        'user.id as resellerId',
        `CONCAT(user.name, ' ', user.sur_name) as resellerName`,
        'COUNT(sale.id) as salesCount'
      ])
      .groupBy('user.id, user.name, user.sur_name')
      .getRawMany<TotalSalesByResellerDto>()

    return rawResult.map((row) => ({
      resellerId: row.resellerId,
      resellerName: row.resellerName,
      salesCount: Number(row.salesCount) // Possibly a string, convert to number
    }))
  }

  async salesInPeriod(start: Date, end: Date): Promise<SalesInPeriodDto> {
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
        `CONCAT(reseller.name, ' ', reseller.sur_name) as resellerName`,
        'reseller.phone as resellerPhone',

        'customer.id as customerId',
        'customer.name as customerName',
        'customer.phone as customerPhone'
      ])
      .getRawMany<SaleReturnRawResult>()

    const sales: SaleReturnDto[] = []

    for (const row of rawSales) {
      const productIds: UUID[] = row.productIds

      const productData = await this.productRepo
        .createQueryBuilder('product')
        .innerJoin(ProductModelTypeOrmEntity, 'pm', 'pm.id = product.model_id')
        .where('p.id IN (:...productIds)', { productIds })
        .select([
          'product.id as productId',
          'product.model_id as productModelId',
          'product.sale_price as salePrice',
          'pm.name as productModelName'
        ])
        .getRawMany<SaleReturnProductDto>()

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
        resellerName: row.resellerName,
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
}
