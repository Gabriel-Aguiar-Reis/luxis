import { ReturnByResellerDto } from '@/modules/kpi/admin/application/dtos/return/return-by-reseller.dto'
import { ReturnWithResellerDto } from '@/modules/kpi/admin/application/dtos/return/return-with-reseller.dto'
import {
  ReturnDto,
  ReturnProduct
} from '@/modules/kpi/admin/application/dtos/return/return.dto'
import { ReturnsInPeriodDto } from '@/modules/kpi/admin/application/dtos/return/returns-in-period.dto'
import { TotalReturnsByResellerDto } from '@/modules/kpi/admin/application/dtos/return/total-returns-by-reseller.dto'
import { TotalReturnsInPeriodDto } from '@/modules/kpi/admin/application/dtos/return/total-returns-in-period.dto'
import { ReturnReadRepository } from '@/modules/kpi/admin/domain/repositories/return-read.repository'
import { ParamsWithMandatoryPeriodDto } from '@/shared/common/dtos/params-with-mandatory-period.dto'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { baseWhere } from '@/shared/common/utils/query-builder.helper'
import { ProductModelTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.entity'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { ReturnTypeOrmEntity } from '@/shared/infra/persistence/typeorm/return/return.typeorm.entity'
import { UserTypeOrmEntity } from '@/shared/infra/persistence/typeorm/user/user.typeorm.entity'
import { UUID } from 'crypto'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

type ReturnByResellerRawResult = {
  id: UUID
  resellerId: UUID
  resellerName: string
  productIds: UUID[]
}

export class ReturnReadTypeormRepository implements ReturnReadRepository {
  constructor(
    @InjectRepository(ReturnTypeOrmEntity)
    private readonly returnRepo: Repository<ReturnTypeOrmEntity>,
    @InjectRepository(ProductTypeOrmEntity)
    private readonly productRepo: Repository<ProductTypeOrmEntity>
  ) {}

  async ReturnsByResellerId(
    resellerId: UUID,
    qParams: ParamsDto
  ): Promise<ReturnByResellerDto> {
    const qb = this.returnRepo
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

    const products = await this.productRepo
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
        'productModel.name as "productModelName"'
      ])
      .getRawMany<ReturnProduct>()

    const productMap = new Map<
      UUID,
      {
        productId: UUID
        productModelId: UUID
        productModelName: string
      }
    >()
    products.forEach((p) => productMap.set(p.productId, p))

    const returns = resReturns.map((ret) => {
      const returnProducts = ret.productIds.map((pid) => {
        const product = productMap.get(pid)!
        return {
          productId: product.productId,
          productModelId: product.productModelId,
          productModelName: product.productModelName
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

  async TotalReturnsByResellerId(
    resellerId: UUID,
    qParams: ParamsDto
  ): Promise<TotalReturnsByResellerDto> {
    const qb = this.returnRepo
      .createQueryBuilder('return')
      .innerJoin(UserTypeOrmEntity, 'user', 'user.id = return.reseller_id')
      .where('return.reseller_id = :resellerId', { resellerId })
      .select([
        'user.id as "resellerId"',
        `CONCAT(user.name, ' ', user.surname) as "resellerName"`,
        'COUNT(return.id) as "totalReturns"'
      ])
      .groupBy('user.id, user.name, user.surname')

    const filteredReturns = baseWhere(qb, qParams, 'return.created_at')
    const result = await filteredReturns.getRawOne<TotalReturnsByResellerDto>()

    return result || { resellerId, resellerName: '', totalReturns: 0 }
  }

  async ReturnsByReseller(qParams: ParamsDto): Promise<ReturnByResellerDto[]> {
    const qb = this.returnRepo
      .createQueryBuilder('return')
      .innerJoin(UserTypeOrmEntity, 'user', 'user.id = return.reseller_id')
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

    const products = await this.productRepo
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
        'productModel.name as "productModelName"'
      ])
      .getRawMany<ReturnProduct>()

    const productMap = new Map<
      UUID,
      {
        productId: UUID
        productModelId: UUID
        productModelName: string
      }
    >()
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
          productModelName: product.productModelName
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

  async TotalReturnsByReseller(
    qParams: ParamsDto
  ): Promise<TotalReturnsByResellerDto[]> {
    const qb = this.returnRepo
      .createQueryBuilder('return')
      .innerJoin(UserTypeOrmEntity, 'user', 'user.id = return.reseller_id')
      .select([
        'user.id as "resellerId"',
        `CONCAT(user.name, ' ', user.surname) as "resellerName"`,
        'COUNT(return.id) as "totalReturns"'
      ])
      .groupBy('user.id, user.name, user.surname')
    const filteredReturns = baseWhere(qb, qParams, 'return.created_at')
    return filteredReturns.getRawMany<TotalReturnsByResellerDto>()
  }

  async ReturnsInPeriod(
    qParams: ParamsWithMandatoryPeriodDto
  ): Promise<ReturnsInPeriodDto> {
    const qb = this.returnRepo
      .createQueryBuilder('return')
      .innerJoin(UserTypeOrmEntity, 'user', 'user.id = return.reseller_id')
      .select([
        'return.id as "id"',
        'user.id as "resellerId"',
        `CONCAT(user.name, ' ', user.surname) as "resellerName"`,
        'return.items as "productIds"'
      ])
    const filteredReturns = baseWhere(qb, qParams, 'return.created_at')

    const resReturns = await filteredReturns.getRawMany<{
      id: UUID
      resellerId: UUID
      resellerName: string
      productIds: UUID[]
    }>()

    const allProductIds = [...new Set(resReturns.flatMap((r) => r.productIds))]

    const products = await this.productRepo
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
        'productModel.name as "productModelName"'
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
          productModelName: product.productModelName
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

  async TotalReturnsInPeriod(
    qParams: ParamsWithMandatoryPeriodDto
  ): Promise<TotalReturnsInPeriodDto> {
    const qb = this.returnRepo.createQueryBuilder('return')
    const filteredReturns = baseWhere(qb, qParams, 'return.created_at')

    const totalReturns = await filteredReturns.getCount()

    return {
      start: qParams.start,
      end: qParams.end,
      totalReturns
    }
  }
}
