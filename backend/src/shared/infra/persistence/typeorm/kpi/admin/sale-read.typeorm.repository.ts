import { ParamsWithMandatoryPeriodDto } from '@/shared/common/dtos/params-with-mandatory-period.dto'
import { SaleReturnProductDto } from '@/modules/kpi/admin/application/dtos/sale/sale-return-product.dto'
import { SaleReturnDto } from '@/modules/kpi/admin/application/dtos/sale/sale-return.dto'
import { SalesByResellerDto } from '@/modules/kpi/admin/application/dtos/sale/sales-by-reseller.dto'
import { SalesInPeriodDto } from '@/modules/kpi/admin/application/dtos/sale/sales-in-period.dto'
import { TotalSalesByResellerDto } from '@/modules/kpi/admin/application/dtos/sale/total-sales-by-reseller.dto'
import { TotalSalesInPeriodDto } from '@/modules/kpi/admin/application/dtos/sale/total-sales-in-period.dto'
import { SaleReadRepository } from '@/modules/kpi/admin/domain/repositories/sale-read.repository'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { parsePgUuidArray } from '@/shared/common/utils/parse-pg-uuid-array.helper'
import { baseWhere } from '@/shared/common/utils/query-builder.helper'
import { CustomerTypeOrmEntity } from '@/shared/infra/persistence/typeorm/customer/customer.typeorm.entity'
import { ProductModelTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.entity'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { SaleTypeOrmEntity } from '@/shared/infra/persistence/typeorm/sale/sale.typeorm.entity'
import { UserTypeOrmEntity } from '@/shared/infra/persistence/typeorm/user/user.typeorm.entity'
import { NotFoundException } from '@nestjs/common'
import { UUID } from 'crypto'
import { Repository } from 'typeorm'
import { SaleByResellerReturnDto } from '@/modules/kpi/admin/application/dtos/sale/sale-by-reseller-return.dto'
import { TotalBillingReturnDto } from '@/modules/kpi/admin/application/dtos/sale/total-billing-return.dto'
import { BatchTypeOrmEntity } from '@/shared/infra/persistence/typeorm/batch/batch.typeorm.entity'
import { InjectRepository } from '@nestjs/typeorm'

type SaleByResellerIdReturnRawResult = {
  id: UUID
  saleDate: Date
  totalAmount: string
  paymentMethod: string
  numberInstallments: number
  status: string
  productIds: string
  customerId: UUID
  customerName: string
  customerPhone: string
}

type SaleReturnRawResult = SaleByResellerIdReturnRawResult & {
  resellerId: UUID
  resellerName: string
  resellerPhone: string
}

export class SaleReadTypeormRepository implements SaleReadRepository {
  constructor(
    @InjectRepository(SaleTypeOrmEntity)
    private readonly saleRepo: Repository<SaleTypeOrmEntity>,
    @InjectRepository(UserTypeOrmEntity)
    private readonly userRepo: Repository<UserTypeOrmEntity>,
    @InjectRepository(ProductTypeOrmEntity)
    private readonly productRepo: Repository<ProductTypeOrmEntity>
  ) {}

  async salesByResellerId(
    resellerId: UUID,
    qParams: ParamsDto
  ): Promise<SalesByResellerDto> {
    const reseller = await this.userRepo.findOne({
      where: { id: resellerId },
      select: ['id', 'name', 'surname']
    })

    if (!reseller) throw new NotFoundException()

    const qb = this.saleRepo
      .createQueryBuilder('sale')
      .innerJoin(UserTypeOrmEntity, 'user', 'user.id = sale.reseller_id')
      .innerJoin(
        CustomerTypeOrmEntity,
        'customer',
        'customer.id = sale.customer_id'
      )
      .where('sale.reseller_id = :resellerId', { resellerId })
      .select([
        'sale.id as id',
        'sale.sale_date as saleDate',
        'sale.total_amount as totalAmount',
        'sale.payment_method as paymentMethod',
        'sale.number_installments as numberInstallments',
        'sale.product_ids as productIds',
        'sale.status as status',
        'sale.customer_id as customerId',
        'customer.name as customerName',
        'customer.phone as customerPhone'
      ])

    const filteredSales = baseWhere(qb, qParams, 'sale.sale_date')

    const resSales =
      await filteredSales.getRawMany<SaleByResellerIdReturnRawResult>()

    const parsedSales = resSales.map((s) => ({
      ...s,
      productIds: parsePgUuidArray(s.productIds)
    }))

    const allProductIds = [...new Set(parsedSales.flatMap((s) => s.productIds))]

    const products = await this.productRepo
      .createQueryBuilder('product')
      .innerJoin(
        ProductModelTypeOrmEntity,
        'productModel',
        'productModel.id = product.model_id'
      )
      .where('product.id IN (:...productIds)', { productIds: allProductIds })
      .select([
        'product.id as productId',
        'productModel.id as productModelId',
        'productModel.name as productModelName',
        'product.sale_price as salePrice'
      ])
      .getRawMany<SaleReturnProductDto>()

    const productMap = new Map<
      UUID,
      {
        productId: UUID
        productModelId: UUID
        productModelName: string
        salePrice: number
      }
    >()
    products.forEach((p) => productMap.set(p.productId, p))

    const sales = parsedSales.map((ret) => {
      const returnProducts = ret.productIds.map((pid) => {
        const product = productMap.get(pid)!
        return {
          productId: product.productId,
          productModelId: product.productModelId,
          productModelName: product.productModelName,
          salePrice: product.salePrice
        }
      })

      return {
        id: ret.id,
        saleDate: ret.saleDate,
        totalAmount: ret.totalAmount,
        paymentMethod: ret.paymentMethod,
        numberInstallments: ret.numberInstallments,
        status: ret.status,
        customerId: ret.customerId,
        customerName: ret.customerName,
        customerPhone: ret.customerPhone,
        products: returnProducts
      }
    })

    const totalSales = sales.reduce(
      (sum, sale) => sum + Number(sale.totalAmount),
      0
    )

    const salesCount = sales.length

    return {
      resellerId: reseller.id,
      resellerName: `${reseller.name} ${reseller.surname}`,
      sales,
      totalSales: totalSales.toString(),
      salesCount
    }
  }

  async totalSalesByResellerId(
    resellerId: UUID,
    qParams: ParamsDto
  ): Promise<TotalSalesByResellerDto> {
    throw new Error('Method not implemented.')
  }

  async salesByReseller(qParams: ParamsDto): Promise<SalesByResellerDto[]> {
    const resellerQb = this.saleRepo
      .createQueryBuilder('sale')
      .innerJoin(UserTypeOrmEntity, 'user', 'user.id = sale.reseller_id')
      .select([
        'user.id as resellerId',
        `CONCAT(user.name, ' ', user.surname) as resellerName`,
        'COUNT(sale.id) as salesCount'
      ])
      .groupBy('user.id, user.name, user.surname')
      .orderBy('COUNT(sale.id)', 'DESC')

    const filtered = baseWhere(resellerQb, qParams, 'sale.sale_date')
    const topResellers = await filtered.getRawMany<{
      resellerId: UUID
      resellerName: string
      salesCount: string
    }>()

    const resellerIds = topResellers.map((r) => r.resellerId)

    if (resellerIds.length === 0) return []

    const salesQb = this.saleRepo
      .createQueryBuilder('sale')
      .innerJoin(
        CustomerTypeOrmEntity,
        'customer',
        'customer.id = sale.customer_id'
      )
      .where('sale.reseller_id IN (:...resellerIds)', { resellerIds })
      .select([
        'sale.id as id',
        'sale.sale_date as saleDate',
        'sale.total_amount as totalAmount',
        'sale.payment_method as paymentMethod',
        'sale.number_installments as numberInstallments',
        'sale.product_ids as productIds',
        'sale.status as status',
        'sale.customer_id as customerId',
        'customer.name as customerName',
        'customer.phone as customerPhone',
        'sale.reseller_id as resellerId'
      ])

    const filteredSalesQb = baseWhere(salesQb, qParams, 'sale.sale_date')
    const rawSales = await filteredSalesQb.getRawMany<
      SaleByResellerIdReturnRawResult & { resellerId: UUID }
    >()

    const parsedSales = rawSales.map((s) => ({
      ...s,
      productIds: parsePgUuidArray(s.productIds)
    }))

    const allProductIds = [...new Set(parsedSales.flatMap((s) => s.productIds))]

    const allProducts = await this.productRepo
      .createQueryBuilder('product')
      .innerJoin(ProductModelTypeOrmEntity, 'pm', 'pm.id = product.model_id')
      .where('product.id IN (:...productIds)', { productIds: allProductIds })
      .select([
        'product.id as productId',
        'pm.id as productModelId',
        'pm.name as productModelName',
        'product.sale_price as salePrice'
      ])
      .getRawMany<SaleReturnProductDto>()

    const productMap = new Map<UUID, SaleReturnProductDto>()
    allProducts.forEach((p) => productMap.set(p.productId, p))

    const salesGroupedByReseller = new Map<
      UUID,
      {
        sales: SaleByResellerReturnDto[]
        totalSales: number
      }
    >()

    for (const row of parsedSales) {
      const products = row.productIds.map((pid) => {
        const p = productMap.get(pid)!
        return {
          productId: p.productId,
          productModelId: p.productModelId,
          productModelName: p.productModelName,
          salePrice: p.salePrice
        }
      })

      const sale = {
        id: row.id,
        saleDate: row.saleDate,
        totalAmount: row.totalAmount,
        paymentMethod: row.paymentMethod,
        numberInstallments: row.numberInstallments,
        status: row.status,
        customerId: row.customerId,
        customerName: row.customerName,
        customerPhone: row.customerPhone,
        products
      }

      if (!salesGroupedByReseller.has(row.resellerId)) {
        salesGroupedByReseller.set(row.resellerId, {
          sales: [],
          totalSales: 0
        })
      }

      const group = salesGroupedByReseller.get(row.resellerId)!
      group.sales.push(sale)
      group.totalSales += Number(sale.totalAmount)
    }

    const result: SalesByResellerDto[] = topResellers.map((reseller) => {
      const group = salesGroupedByReseller.get(reseller.resellerId)

      return {
        resellerId: reseller.resellerId,
        resellerName: reseller.resellerName,
        sales: group?.sales || [],
        totalSales: (group?.totalSales || 0).toFixed(2),
        salesCount: group?.sales.length || 0
      }
    })

    return result
  }

  async totalSalesByReseller(
    qParams: ParamsDto
  ): Promise<TotalSalesByResellerDto[]> {
    const qb = this.saleRepo
      .createQueryBuilder('sale')
      .innerJoin(UserTypeOrmEntity, 'user', 'user.id = sale.resellerId')
      .select([
        'user.id as resellerId',
        `CONCAT(user.name, ' ', user.surname) as resellerName`,
        'COUNT(sale.id) as salesCount'
      ])
      .groupBy('user.id, user.name, user.surname')

    const filteredSales = baseWhere(qb, qParams, 'sale.sale_date')

    const rawResult = await filteredSales.getRawMany<TotalSalesByResellerDto>()

    return rawResult.map((row) => ({
      resellerId: row.resellerId,
      resellerName: row.resellerName,
      salesCount: Number(row.salesCount) // Possibly a string, convert to number
    }))
  }

  async salesInPeriod(
    qParams: ParamsWithMandatoryPeriodDto
  ): Promise<SalesInPeriodDto> {
    const qb = this.saleRepo
      .createQueryBuilder('sale')
      .innerJoin(
        UserTypeOrmEntity,
        'reseller',
        'reseller.id = sale.reseller_id'
      )
      .innerJoin(
        CustomerTypeOrmEntity,
        'customer',
        'customer.id = sale.customer_id'
      )
      .select([
        'sale.id as id',
        'sale.sale_date as saleDate',
        'sale.total_amount as totalAmount',
        'sale.payment_method as paymentMethod',
        'sale.number_installments as numberInstallments',
        'sale.status as status',
        'sale.product_ids as productIds',

        'reseller.id as resellerId',
        `CONCAT(reseller.name, ' ', reseller.surname) as resellerName`,
        'reseller.phone as resellerPhone',

        'customer.id as customerId',
        'customer.name as customerName',
        'customer.phone as customerPhone'
      ])

    const filteredSales = baseWhere(qb, qParams, 'sale.sale_date')

    const rawSales = await filteredSales.getRawMany<SaleReturnRawResult>()

    const parsedSales = rawSales.map((s) => ({
      ...s,
      productIds: parsePgUuidArray(s.productIds)
    }))

    const allProductIds = [...new Set(parsedSales.flatMap((s) => s.productIds))]

    const allProducts = await this.productRepo
      .createQueryBuilder('product')
      .innerJoin(ProductModelTypeOrmEntity, 'pm', 'pm.id = product.model_id')
      .where('product.id IN (:...productIds)', { productIds: allProductIds })
      .select([
        'product.id as productId',
        'pm.id as productModelId',
        'pm.name as productModelName',
        'product.sale_price as salePrice'
      ])
      .getRawMany<SaleReturnProductDto>()

    const productMap = new Map<UUID, SaleReturnProductDto>()
    allProducts.forEach((p) => productMap.set(p.productId, p))

    const sales: SaleReturnDto[] = parsedSales.map((row) => ({
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
      products: row.productIds.map((pid) => {
        const product = productMap.get(pid)!
        return {
          productId: product.productId,
          productModelId: product.productModelId,
          productModelName: product.productModelName,
          salePrice: product.salePrice
        }
      })
    }))

    return {
      start: qParams.start,
      end: qParams.end,
      sales
    }
  }

  async totalSalesInPeriod(
    qParams: ParamsWithMandatoryPeriodDto
  ): Promise<TotalSalesInPeriodDto> {
    const qb = this.saleRepo.createQueryBuilder('sale')

    const filteredSales = baseWhere(qb, qParams, 'sale.sale_date')

    const totalSales = await filteredSales.getCount()

    return { start: qParams.start, end: qParams.end, totalSales }
  }

  async totalBillingByBatchId(batchId: UUID): Promise<TotalBillingReturnDto> {
    const result = await this.saleRepo
      .createQueryBuilder('sale')
      .innerJoin('sale.products', 'product')
      .innerJoin(BatchTypeOrmEntity, 'batch', 'batch.id = product.batch_id')
      .where('batch.id = :batchId', { batchId })
      .select('SUM(sale.total_amount)', 'total')
      .getRawOne<{ total: string }>()

    return {
      start: new Date(0),
      end: new Date(),
      total: parseFloat(result?.total || '0')
    }
  }

  async totalBillingByResellerId(
    resellerId: UUID,
    qParams: ParamsWithMandatoryPeriodDto
  ): Promise<TotalBillingReturnDto> {
    const qb = this.saleRepo
      .createQueryBuilder('sale')
      .innerJoin('sale.products', 'product')
      .where('sale.reseller_id = :resellerId', { resellerId })
      .select('SUM(sale.total_amount)', 'total')

    const filteredSales = baseWhere(qb, qParams, 'sale.sale_date')

    const result = await filteredSales.getRawOne<{ total: string }>()

    return {
      start: qParams.start,
      end: qParams.end,
      total: parseFloat(result?.total || '0')
    }
  }

  async totalBillingByPeriod(
    qParams: ParamsWithMandatoryPeriodDto
  ): Promise<TotalBillingReturnDto> {
    const qb = this.saleRepo
      .createQueryBuilder('sale')
      .innerJoin('sale.products', 'product')
      .select('SUM(sale.total_amount)', 'total')

    const filteredSales = baseWhere(qb, qParams, 'sale.sale_date')
    const result = await filteredSales.getRawOne<{ total: string }>()

    return {
      start: qParams.start,
      end: qParams.end,
      total: parseFloat(result?.total || '0')
    }
  }
}
