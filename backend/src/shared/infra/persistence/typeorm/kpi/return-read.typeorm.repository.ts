import { ReturnDto } from '@/modules/kpi/application/dtos/return.dto'
import { ReturnsInPeriodDto } from '@/modules/kpi/application/dtos/returns-in-period.dto'
import { TotalReturnsByResellerDto } from '@/modules/kpi/application/dtos/total-returns-by-reseller.dto'
import { TotalReturnsInPeriodDto } from '@/modules/kpi/application/dtos/total-returns-in-period.dto'
import { ReturnReadRepository } from '@/modules/kpi/domain/repositories/return-read.repository'
import { ProductModelTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.entity'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { ReturnTypeOrmEntity } from '@/shared/infra/persistence/typeorm/return/return.typeorm.entity'
import { UserTypeOrmEntity } from '@/shared/infra/persistence/typeorm/user/user.typeorm.entity'
import { UUID } from 'crypto'
import { Repository } from 'typeorm'

type ReturnByResellerRawResult = {
  id: UUID
  resellerId: UUID
  resellerName: string
  productIds: UUID[]
  totalReturns: number
}

export class ReturnReadTypeOrmRepository implements ReturnReadRepository {
  constructor(
    private readonly returnRepo: Repository<ReturnTypeOrmEntity>,
    private readonly productRepo: Repository<ProductTypeOrmEntity>
  ) {}

  async ReturnsByReseller(): Promise<ReturnDto[]> {
    const returns = await this.returnRepo
      .createQueryBuilder('return')
      .innerJoin(UserTypeOrmEntity, 'user', 'user.id = return.resellerId')
      .select([
        'return.id as id',
        'user.id as resellerId',
        'user.name as resellerName',
        'return.items as productIds',
        'COUNT(return.id) as totalReturns'
      ])
      .groupBy('return.id, user.id, user.name, return.items')
      .getRawMany<ReturnByResellerRawResult>()

    const allProductIds = [...new Set(returns.flatMap((r) => r.productIds))]

    const products = await this.productRepo
      .createQueryBuilder('product')
      .innerJoin(
        ProductModelTypeOrmEntity,
        'productModel',
        'productModel.id = product.productModelId'
      )
      .where('product.id IN (:...productIds)', { productIds: allProductIds })
      .select([
        'product.id as productId',
        'productModel.id as productModelId',
        'productModel.name as productModelName'
      ])
      .getRawMany<{
        productId: UUID
        productModelId: UUID
        productModelName: string
      }>()

    const result = returns.map((row) => ({
      id: row.id,
      resellerId: row.resellerId,
      resellerName: row.resellerName,
      totalReturns: row.totalReturns,
      products: products
    }))

    return result
  }

  async TotalReturnsByReseller(): Promise<TotalReturnsByResellerDto[]> {
    const totals = await this.returnRepo
      .createQueryBuilder('return')
      .innerJoin(UserTypeOrmEntity, 'user', 'user.id = return.resellerId')
      .select([
        'user.id as resellerId',
        `CONCAT(user.name, ' ', user.sur_name) as resellerName`,
        'COUNT(return.id) as totalReturns'
      ])
      .groupBy('user.id, user.name, user.sur_name')
      .getRawMany<TotalReturnsByResellerDto>()

    return totals
  }

  async ReturnsInPeriod(start: Date, end: Date): Promise<ReturnsInPeriodDto> {
    const partialReturns = await this.returnRepo
      .createQueryBuilder('return')
      .innerJoin(UserTypeOrmEntity, 'user', 'user.id = return.resellerId')
      .select([
        'return.id as id',
        'user.id as resellerId',
        'user.name as resellerName',
        'return.items as productIds',
        'COUNT(return.id) as totalReturns'
      ])
      .where('return.created_at BETWEEN :start AND :end', { start, end })
      .groupBy('return.id, user.id, user.name, return.items')
      .getRawMany<ReturnByResellerRawResult>()

    const allProductIds = [
      ...new Set(partialReturns.flatMap((r) => r.productIds))
    ]

    const products = await this.productRepo
      .createQueryBuilder('product')
      .innerJoin(
        ProductModelTypeOrmEntity,
        'productModel',
        'productModel.id = product.productModelId'
      )
      .where('product.id IN (:...productIds)', { productIds: allProductIds })
      .select([
        'product.id as productId',
        'productModel.id as productModelId',
        'productModel.name as productModelName'
      ])
      .getRawMany<{
        productId: UUID
        productModelId: UUID
        productModelName: string
      }>()

    const returns = partialReturns.map((row) => ({
      id: row.id,
      resellerId: row.resellerId,
      resellerName: row.resellerName,
      totalReturns: row.totalReturns,
      products: products
    }))

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
