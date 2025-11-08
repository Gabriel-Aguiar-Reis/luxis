import { UUID } from 'crypto'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { Repository } from 'typeorm'
import { SaleTypeOrmEntity } from '@/shared/infra/persistence/typeorm/sale/sale.typeorm.entity'
import { UserTypeOrmEntity } from '@/shared/infra/persistence/typeorm/user/user.typeorm.entity'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { ProductModelTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.entity'
import { CustomerTypeOrmEntity } from '@/shared/infra/persistence/typeorm/customer/customer.typeorm.entity'
import { baseWhere } from '@/shared/common/utils/query-builder.helper'
import { SaleByResellerIdReturnRawResult } from '@/modules/kpi/admin/application/dtos/sale/sale-types'
import { SaleReturnProductDto } from '@/modules/kpi/admin/application/dtos/sale/sale-return-product.dto'
import { SalesByResellerDto } from '@/modules/kpi/admin/application/dtos/sale/sales-by-reseller.dto'
import { SaleByResellerReturnDto } from '@/modules/kpi/admin/application/dtos/sale/sale-by-reseller-return.dto'
import {
  buildProductMap,
  mapProducts
} from '@/modules/kpi/admin/application/helpers/sale-read.helpers'

export async function salesByReseller(
  saleRepo: Repository<SaleTypeOrmEntity>,
  productRepo: Repository<ProductTypeOrmEntity>,
  qParams: ParamsDto
): Promise<SalesByResellerDto[]> {
  const resellerQb = saleRepo
    .createQueryBuilder('sale')
    .innerJoin(UserTypeOrmEntity, 'user', 'user.id = sale.reseller_id')
    .select([
      'user.id as "resellerId"',
      `CONCAT(user.name, ' ', user.surname) as "resellerName"`,
      'COUNT(sale.id) as "salesCount"'
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
  const salesQb = saleRepo
    .createQueryBuilder('sale')
    .innerJoin(
      CustomerTypeOrmEntity,
      'customer',
      'customer.id = sale.customer_id'
    )
    .where('sale.reseller_id IN (:...resellerIds)', { resellerIds })
    .select([
      'sale.id as "id"',
      'sale.sale_date as "saleDate"',
      'sale.total_amount as "totalAmount"',
      'sale.payment_method as "paymentMethod"',
      'sale.number_installments as "numberInstallments"',
      'sale.product_ids as "productIds"',
      'sale.status as "status"',
      'sale.customer_id as "customerId"',
      'customer.name as "customerName"',
      'customer.phone as "customerPhone"',
      'sale.reseller_id as "resellerId"'
    ])
  const filteredSalesQb = baseWhere(salesQb, qParams, 'sale.sale_date')
  const rawSales = await filteredSalesQb.getRawMany<
    SaleByResellerIdReturnRawResult & { resellerId: UUID }
  >()
  const allProductIds = [...new Set(rawSales.flatMap((s) => s.productIds))]

  // Se não há produtos, retorna vazio
  if (allProductIds.length === 0) {
    return []
  }

  const allProducts = await productRepo
    .createQueryBuilder('product')
    .innerJoin(ProductModelTypeOrmEntity, 'pm', 'pm.id = product.model_id')
    .where('product.id IN (:...productIds)', { productIds: allProductIds })
    .select([
      'product.id as "productId"',
      'pm.id as "productModelId"',
      'pm.name as "productModelName"',
      'product.sale_price as "salePrice"'
    ])
    .getRawMany<SaleReturnProductDto>()
  const productMap = buildProductMap(allProducts)
  const salesGroupedByReseller = new Map<
    UUID,
    {
      sales: SaleByResellerReturnDto[]
      totalSales: number
    }
  >()
  for (const row of rawSales) {
    const products = mapProducts(row.productIds, productMap)
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
