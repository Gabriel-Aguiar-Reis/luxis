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
import { ProductModelTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.entity'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { ReturnTypeOrmEntity } from '@/shared/infra/persistence/typeorm/return/return.typeorm.entity'
import { UserTypeOrmEntity } from '@/shared/infra/persistence/typeorm/user/user.typeorm.entity'
import { UUID } from 'crypto'
import { Repository, SelectQueryBuilder } from 'typeorm'

type ReturnByResellerRawResult = {
  id: UUID
  resellerId: UUID
  resellerName: string
  productIds: string
}

function baseWhere(
  qb: SelectQueryBuilder<ReturnTypeOrmEntity>,
  start?: Date,
  end?: Date
) {
  if (start) {
    qb.andWhere('return.created_at >= :start', { start })
  }

  if (end) {
    qb.andWhere('return.created_at <= :end', { end })
  }

  return qb
}

function parsePgUuidArray(arrayStr: string): UUID[] {
  return arrayStr.replace(/^{|}$/g, '').split(',').filter(Boolean) as UUID[]
}

export class ReturnReadTypeOrmRepository implements ReturnReadRepository {
  constructor(
    private readonly returnRepo: Repository<ReturnTypeOrmEntity>,
    private readonly productRepo: Repository<ProductTypeOrmEntity>
  ) {}

  async ReturnsByResellerId(
    resellerId: UUID,
    start?: Date,
    end?: Date
  ): Promise<ReturnByResellerDto> {
    throw new Error('Method not implemented.')
  }

  async TotalReturnsByResellerId(
    resellerId: UUID,
    start?: Date,
    end?: Date
  ): Promise<TotalReturnsByResellerDto> {
    throw new Error('Method not implemented.')
  }

  async ReturnsByReseller(
    start?: Date,
    end?: Date
  ): Promise<ReturnByResellerDto[]> {
    const rawReturns = await baseWhere(
      this.returnRepo
        .createQueryBuilder('return')
        .innerJoin(UserTypeOrmEntity, 'user', 'user.id = return.reseller_id')
        .select([
          'return.id as id',
          'return.reseller_id as resellerId',
          `CONCAT(user.name, ' ', user.sur_name) as resellerName`,
          'return.items as productIds'
        ]),
      start,
      end
    ).getRawMany<ReturnByResellerRawResult>()

    const parsedReturns = rawReturns.map((r) => ({
      ...r,
      productIds: parsePgUuidArray(r.productIds)
    }))

    const allProductIds = [
      ...new Set(parsedReturns.flatMap((r) => r.productIds))
    ]

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
        'productModel.name as productModelName'
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

    for (const ret of parsedReturns) {
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
    start?: Date,
    end?: Date
  ): Promise<TotalReturnsByResellerDto[]> {
    const totals = await baseWhere(
      this.returnRepo
        .createQueryBuilder('return')
        .innerJoin(UserTypeOrmEntity, 'user', 'user.id = return.reseller_id')
        .select([
          'user.id as resellerId',
          `CONCAT(user.name, ' ', user.sur_name) as resellerName`,
          'COUNT(return.id) as totalReturns'
        ])
        .groupBy('user.id, user.name, user.sur_name'),
      start,
      end
    ).getRawMany<TotalReturnsByResellerDto>()

    return totals
  }

  async ReturnsInPeriod(start: Date, end: Date): Promise<ReturnsInPeriodDto> {
    const rawReturns = await this.returnRepo
      .createQueryBuilder('return')
      .innerJoin(UserTypeOrmEntity, 'user', 'user.id = return.reseller_id')
      .select([
        'return.id as id',
        'user.id as resellerId',
        `CONCAT(user.name, ' ', user.sur_name) as resellerName`,
        'return.items as productIds'
      ])
      .where('return.created_at BETWEEN :start AND :end', { start, end })
      .getRawMany<{
        id: UUID
        resellerId: UUID
        resellerName: string
        productIds: string
      }>()

    const parsedReturns = rawReturns.map((r) => ({
      ...r,
      productIds: parsePgUuidArray(r.productIds)
    }))

    const allProductIds = [
      ...new Set(parsedReturns.flatMap((r) => r.productIds))
    ]

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
        'productModel.name as productModelName'
      ])
      .getRawMany<ReturnProduct>()

    const productMap = new Map<UUID, ReturnProduct>()
    products.forEach((p) => productMap.set(p.productId, p))

    const returns: ReturnWithResellerDto[] = parsedReturns.map((ret) => {
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
      start,
      end,
      returns
    }
  }

  async TotalReturnsInPeriod(
    start: Date,
    end: Date
  ): Promise<TotalReturnsInPeriodDto> {
    const totalReturns = await this.returnRepo
      .createQueryBuilder('return')
      .where('return.created_at BETWEEN :start AND :end', { start, end })
      .getCount()

    return {
      start,
      end,
      totalReturns
    }
  }
}
