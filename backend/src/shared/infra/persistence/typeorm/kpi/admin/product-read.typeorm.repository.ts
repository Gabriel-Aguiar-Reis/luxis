import { ProductInStockDto } from '@/modules/kpi/admin/application/dtos/product/product-in-stock.dto'
import { ProductWithResellerDto } from '@/modules/kpi/admin/application/dtos/product/product-with-reseller.dto'
import { ProductReadRepository } from '@/modules/kpi/admin/domain/repositories/product-read.repository'
import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
import { ProductModelTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.entity'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { UUID } from 'crypto'
import { Repository } from 'typeorm'

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
    start?: Date,
    end?: Date
  ): Promise<ProductWithResellerDto[]> {
    const rawProducts = await this.productRepo
      .createQueryBuilder('product')
      .innerJoin(
        ProductModelTypeOrmEntity,
        'productModel',
        'productModel.id = product.productModelId'
      )
      .select([
        'product.id as id',
        'product.serialNumber as serialNumber',
        'product.productModelId as modelId',
        'productModel.name as modelName',
        'product.batchId as batchId',
        'product.unitCost as unitCost',
        'product.salePrice as salePrice',
        'product.status as status'
      ])
      .where('product.status = :status', { status: ProductStatus.ASSIGNED })
      .getRawMany<ProductWithResellerRawResult>()

    return rawProducts.map((row) => ({
      id: row.id,
      serialNumber: row.serialNumber,
      modelId: row.modelId,
      modelName: row.modelName,
      batchId: row.batchId,
      unitCost: row.unitCost,
      salePrice: row.salePrice
    }))
  }

  async totalProductsWithResellers(start?: Date, end?: Date): Promise<number> {
    const products = await this.productRepo
      .createQueryBuilder('product')
      .where('product.status = :status', { status: ProductStatus.ASSIGNED })
      .getCount()
    return products
  }

  async productsInStock(
    start?: Date,
    end?: Date
  ): Promise<ProductInStockDto[]> {
    const rawProducts = await this.productRepo
      .createQueryBuilder('product')
      .innerJoin(
        ProductModelTypeOrmEntity,
        'productModel',
        'productModel.id = product.productModelId'
      )
      .select([
        'product.id as id',
        'product.serialNumber as serialNumber',
        'product.productModelId as modelId',
        'productModel.name as modelName',
        'product.batchId as batchId',
        'product.unitCost as unitCost',
        'product.salePrice as salePrice',
        'product.status as status'
      ])
      .where('product.status = :status', { status: ProductStatus.IN_STOCK })
      .getRawMany<ProductInStockRawResult>()

    return rawProducts.map((row) => ({
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

  async totalProductsInStock(start?: Date, end?: Date): Promise<number> {
    const products = await this.productRepo
      .createQueryBuilder('product')
      .where('product.status = :status', { status: ProductStatus.IN_STOCK })
      .getCount()
    return products
  }
}
