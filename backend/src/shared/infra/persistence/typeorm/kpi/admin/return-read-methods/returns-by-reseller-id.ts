import { UUID } from 'crypto'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { Repository } from 'typeorm'
import { ReturnTypeOrmEntity } from '@/shared/infra/persistence/typeorm/return/return.typeorm.entity'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { ProductModelTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.entity'
import { UserTypeOrmEntity } from '@/shared/infra/persistence/typeorm/user/user.typeorm.entity'
import { baseWhere } from '@/shared/common/utils/query-builder.helper'
import { ReturnByResellerDto } from '@/modules/kpi/admin/application/dtos/return/return-by-reseller.dto'
import { ReturnProduct } from '@/modules/kpi/admin/application/dtos/return/return.dto'

type ReturnByResellerRawResult = {
  id: UUID
  resellerId: UUID
  resellerName: string
  productIds: UUID[]
}

export async function returnsByResellerId(
  returnRepo: Repository<ReturnTypeOrmEntity>,
  productRepo: Repository<ProductTypeOrmEntity>,
  resellerId: UUID,
  qParams: ParamsDto
): Promise<ReturnByResellerDto> {
  const qb = returnRepo
    .createQueryBuilder('return')
    .innerJoin(UserTypeOrmEntity, 'user', 'user.id = return.reseller_id')
    .where('return.reseller_id = :resellerId', { resellerId })
    .select([
      'return.id as "id"',
      'return.reseller_id as "resellerId"',
      `CONCAT(user.name, ' ', user.surname) as "resellerName"`,
      'return.product_ids as "productIds"'
    ])

  const filteredReturns = baseWhere(qb, qParams, 'return.created_at')
  const resReturns =
    await filteredReturns.getRawMany<ReturnByResellerRawResult>()

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

  const productMap = new Map<
    UUID,
    {
      productId: UUID
      productModelId: UUID
      productModelName: string
      serialNumber: string
    }
  >()
  products.forEach((p) => productMap.set(p.productId, p))

  const returns = resReturns.map((ret) => {
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
      products: returnProducts
    }
  })

  return {
    resellerId,
    resellerName: resReturns[0]?.resellerName || '',
    returns,
    totalReturns: returns.length
  }
}
