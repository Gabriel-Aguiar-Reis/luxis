import { ParamsWithMandatoryPeriodDto } from '@/shared/common/dtos/params-with-mandatory-period.dto'
import { Repository } from 'typeorm'
import { ReturnTypeOrmEntity } from '@/shared/infra/persistence/typeorm/return/return.typeorm.entity'
import { UserTypeOrmEntity } from '@/shared/infra/persistence/typeorm/user/user.typeorm.entity'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { ProductModelTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.entity'
import { baseWhere } from '@/shared/common/utils/query-builder.helper'
import { ReturnWithResellerDto } from '@/modules/kpi/admin/application/dtos/return/return-with-reseller.dto'
import { ReturnsInPeriodDto } from '@/modules/kpi/admin/application/dtos/return/returns-in-period.dto'
import { ReturnProduct } from '@/modules/kpi/admin/application/dtos/return/return.dto'
import { UUID } from 'crypto'

export async function returnsInPeriod(
  returnRepo: Repository<ReturnTypeOrmEntity>,
  productRepo: Repository<ProductTypeOrmEntity>,
  qParams: ParamsWithMandatoryPeriodDto
): Promise<ReturnsInPeriodDto> {
  const qb = returnRepo
    .createQueryBuilder('return')
    .innerJoin(UserTypeOrmEntity, 'user', 'user.id = return.reseller_id')
    .select([
      'return.id as "id"',
      'user.id as "resellerId"',
      `CONCAT(user.name, ' ', user.surname) as "resellerName"`,
      'return.product_ids as "productIds"'
    ])
  const filteredReturns = baseWhere(qb, qParams, 'return.created_at')

  const resReturns = await filteredReturns.getRawMany<{
    id: UUID
    resellerId: UUID
    resellerName: string
    productIds: UUID[]
  }>()

  const allProductIds = [...new Set(resReturns.flatMap((r) => r.productIds))]

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
      'product.serial_number as "serialNumber"'
    ])
    .getRawMany<ReturnProduct>()

  const productMap = new Map<UUID, ReturnProduct>()
  products.forEach((p) => productMap.set(p.productId, p))

  const returns: ReturnWithResellerDto[] = resReturns.map((ret) => {
    const returnProducts = ret.productIds.map((pid) => {
      const product = productMap.get(pid)!
      return {
        productId: product.productId,
        productModelId: product.productModelId,
        productModelName: product.productModelName,
        serialNumber: product.serialNumber
      }
    })

    return {
      id: ret.id,
      resellerId: ret.resellerId,
      resellerName: ret.resellerName,
      products: returnProducts
    }
  })

  return {
    start: qParams.start,
    end: qParams.end,
    returns
  }
}
