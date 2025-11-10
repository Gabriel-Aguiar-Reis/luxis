import { UUID } from 'crypto'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { NotFoundException } from '@nestjs/common'
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
import {
  buildProductMap,
  mapProducts
} from '@/modules/kpi/admin/application/helpers/sale-read.helpers'

export async function salesByResellerId(
  saleRepo: Repository<SaleTypeOrmEntity>,
  userRepo: Repository<UserTypeOrmEntity>,
  productRepo: Repository<ProductTypeOrmEntity>,
  resellerId: UUID,
  qParams: ParamsDto
): Promise<SalesByResellerDto> {
  const reseller = await userRepo.findOne({
    where: { id: resellerId },
    select: ['id', 'name', 'surname']
  })
  if (!reseller) throw new NotFoundException()
  const qb = saleRepo
    .createQueryBuilder('sale')
    .innerJoin(UserTypeOrmEntity, 'user', 'user.id = sale.reseller_id')
    .innerJoin(
      CustomerTypeOrmEntity,
      'customer',
      'customer.id = sale.customer_id'
    )
    .where('sale.reseller_id = :resellerId', { resellerId })
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
      'customer.phone as "customerPhone"'
    ])
  const filteredSales = baseWhere(qb, qParams, 'sale.sale_date')
  const resSales =
    await filteredSales.getRawMany<SaleByResellerIdReturnRawResult>()
  const allProductIds = [...new Set(resSales.flatMap((s) => s.productIds))]

  // Se não há produtos, retorna vazio
  if (allProductIds.length === 0) {
    return {
      resellerId: reseller.id,
      resellerName: `${reseller.name} ${reseller.surname}`,
      sales: [],
      totalSales: '0',
      salesCount: 0
    }
  }

  const products = await productRepo
    .createQueryBuilder('product')
    .innerJoin(
      ProductModelTypeOrmEntity,
      'productModel',
      'productModel.id = product.model_id'
    )
    .where('product.id IN (:...productIds)', { productIds: allProductIds })
    .select([
      'product.id as "productId"',
      'productModel.id as "productModelId"',
      'productModel.name as "productModelName"',
      'product.sale_price as "salePrice"'
    ])
    .getRawMany<SaleReturnProductDto>()
  const productMap = buildProductMap(products)
  const sales = resSales.map((ret) => {
    const returnProducts = mapProducts(ret.productIds, productMap)
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
