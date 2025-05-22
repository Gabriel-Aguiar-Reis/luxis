import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { ProductInStockDto } from '@/modules/kpi/admin/application/dtos/product/product-in-stock.dto'
import { ProductWithResellerDto } from '@/modules/kpi/admin/application/dtos/product/product-with-reseller.dto'
import { ProductReadRepository } from '@/modules/kpi/admin/domain/repositories/product-read.repository'
import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
import { ProductModelTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.entity'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { UUID } from 'crypto'
import { Repository } from 'typeorm'
import { baseWhere } from '@/shared/common/utils/query-builder.helper'
import { BatchTypeOrmEntity } from '@/shared/infra/persistence/typeorm/batch/batch.typeorm.entity'

type ProductInStockRawResult = {
  id: UUID
  serialNumber: string
  modelId: UUID
  modelName: string
  batchId: UUID
  unitCost: string
  salePrice: string
  status: string
}

type ProductWithResellerRawResult = ProductInStockRawResult

export class ProductReadTypeOrmRepository implements ProductReadRepository {
  constructor(private readonly productRepo: Repository<ProductTypeOrmEntity>) {}

  async productsWithResellers(
    qParams: ParamsDto
  ): Promise<ProductWithResellerDto[]> {
    const qb = this.productRepo
      .createQueryBuilder('product')
      .innerJoin(
        ProductModelTypeOrmEntity,
        'productModel',
        'productModel.id = product.model_id'
      )
      .select([
        'product.id as id',
        'product.serial_number as serialNumber',
        'product.model_id as modelId',
        'productModel.name as modelName',
        'product.batch_id as batchId',
        'product.unit_cost as unitCost',
        'product.sale_price as salePrice',
        'product.status as status'
      ])
      .where('product.status = :status', { status: ProductStatus.ASSIGNED })
    const filteredProducts = baseWhere(qb, qParams, 'product.created_at')

    const result =
      await filteredProducts.getRawMany<ProductWithResellerRawResult>()

    return result.map((row) => ({
      id: row.id,
      serialNumber: row.serialNumber,
      modelId: row.modelId,
      modelName: row.modelName,
      batchId: row.batchId,
      unitCost: row.unitCost,
      salePrice: row.salePrice
    }))
  }

  totalProductsWithResellers(qParams: ParamsDto): Promise<number> {
    const qb = this.productRepo
      .createQueryBuilder('product')
      .where('product.status = :status', { status: ProductStatus.ASSIGNED })
    const filteredProducts = baseWhere(qb, qParams, 'product.created_at')

    return filteredProducts.getCount()
  }

  async productsInStock(qParams: ParamsDto): Promise<ProductInStockDto[]> {
    const qb = this.productRepo
      .createQueryBuilder('product')
      .innerJoin(
        ProductModelTypeOrmEntity,
        'productModel',
        'productModel.id = product.model_id'
      )
      .select([
        'product.id as id',
        'product.serial_number as serialNumber',
        'product.model_id as modelId',
        'productModel.name as modelName',
        'product.batch_id as batchId',
        'product.unit_cost as unitCost',
        'product.sale_price as salePrice',
        'product.status as status'
      ])
      .where('product.status = :status', { status: ProductStatus.IN_STOCK })

    const filteredProducts = baseWhere(qb, qParams, 'product.created_at')

    const result = await filteredProducts.getRawMany<ProductInStockRawResult>()

    return result.map((row) => ({
      id: row.id,
      serialNumber: row.serialNumber,
      modelId: row.modelId,
      modelName: row.modelName,
      batchId: row.batchId,
      unitCost: row.unitCost,
      salePrice: row.salePrice,
      status: row.status
    }))
  }

  async totalProductsInStock(qParams: ParamsDto): Promise<number> {
    const qb = this.productRepo
      .createQueryBuilder('product')
      .where('product.status = :status', { status: ProductStatus.IN_STOCK })
    const filteredProducts = baseWhere(qb, qParams, 'product.created_at')
    return await filteredProducts.getCount()
  }

  async productsInStockForMoreThanXDays(
    days: number,
    qParams: ParamsDto
  ): Promise<ProductInStockDto[]> {
    const qb = this.productRepo
      .createQueryBuilder('product')
      .innerJoin(BatchTypeOrmEntity, 'batch', 'batch.id = product.batch_id')
      .innerJoin(
        ProductModelTypeOrmEntity,
        'productModel',
        'productModel.id = product.model_id'
      )
      .where('product.status = :status', { status: ProductStatus.IN_STOCK })
      .andWhere(`batch.created_at < NOW() - INTERVAL '${days} days'`)
      .select([
        'product.id as id',
        'product.serial_number as serialNumber',
        'product.model_id as modelId',
        'productModel.name as modelName',
        'product.batch_id as batchId',
        'product.unit_cost as unitCost',
        'product.sale_price as salePrice',
        'product.status as status'
      ])

    const filteredProducts = baseWhere(qb, qParams, 'batch.created_at')

    const result = await filteredProducts.getRawMany<ProductInStockRawResult>()

    return result.map((row) => ({
      id: row.id,
      serialNumber: row.serialNumber,
      modelId: row.modelId,
      modelName: row.modelName,
      batchId: row.batchId,
      unitCost: row.unitCost,
      salePrice: row.salePrice,
      status: row.status
    }))
  }

  async totalProductsInStockForMoreThanXDays(
    days: number,
    qParams: ParamsDto
  ): Promise<number> {
    const qb = this.productRepo
      .createQueryBuilder('product')
      .innerJoin(BatchTypeOrmEntity, 'batch', 'batch.id = product.batch_id')
      .where('product.status = :status', { status: ProductStatus.IN_STOCK })
      .andWhere(`batch.created_at < NOW() - INTERVAL '${days} days'`)

    const filteredProducts = baseWhere(qb, qParams, 'product.updatedAt')
    return await filteredProducts.getCount()
  }
}
