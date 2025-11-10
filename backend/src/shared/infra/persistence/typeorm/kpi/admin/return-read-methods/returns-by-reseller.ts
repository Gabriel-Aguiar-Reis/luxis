import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { Repository } from 'typeorm'
import { ReturnTypeOrmEntity } from '@/shared/infra/persistence/typeorm/return/return.typeorm.entity'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { ProductModelTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.entity'
import { UserTypeOrmEntity } from '@/shared/infra/persistence/typeorm/user/user.typeorm.entity'
import { baseWhere } from '@/shared/common/utils/query-builder.helper'
import { ReturnByResellerDto } from '@/modules/kpi/admin/application/dtos/return/return-by-reseller.dto'
import {
  ReturnProduct,
  ReturnDto
} from '@/modules/kpi/admin/application/dtos/return/return.dto'
import { UUID } from 'crypto'

export async function returnsByReseller(
  returnRepo: Repository<ReturnTypeOrmEntity>,
  productRepo: Repository<ProductTypeOrmEntity>,
  qParams: ParamsDto
): Promise<ReturnByResellerDto[]> {
  const qb = returnRepo
    .createQueryBuilder('return')
    .innerJoin(UserTypeOrmEntity, 'user', 'user.id = return.reseller_id')
    .select([
      'return.id as "id"',
      'return.reseller_id as "resellerId"',
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

  // Se não há produtos, retorna vazio
  if (allProductIds.length === 0) {
    return []
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
      'product.serial_number as "serialNumber"'
    ])
    .getRawMany<ReturnProduct>()

  const productMap = new Map<UUID, ReturnProduct>()
  products.forEach((p) => productMap.set(p.productId, p))

  const resellerMap = new Map<
    UUID,
    {
      resellerName: string
      returns: ReturnDto[]
    }
  >()

  for (const ret of resReturns) {
    const returnProducts = ret.productIds.map((pid) => {
      const product = productMap.get(pid)!
      return {
        productId: product.productId,
        productModelId: product.productModelId,
        productModelName: product.productModelName,
        serialNumber: product.serialNumber
      }
    })

    const returnDto: ReturnDto = {
      id: ret.id,
      products: returnProducts
    }

    if (!resellerMap.has(ret.resellerId)) {
      resellerMap.set(ret.resellerId, {
        resellerName: ret.resellerName,
        returns: [returnDto]
      })
    } else {
      resellerMap.get(ret.resellerId)!.returns.push(returnDto)
    }
  }

  const result: ReturnByResellerDto[] = Array.from(resellerMap.entries()).map(
    ([resellerId, data]) => ({
      resellerId,
      resellerName: data.resellerName,
      returns: data.returns,
      totalReturns: data.returns.length
    })
  )

  return result
}
