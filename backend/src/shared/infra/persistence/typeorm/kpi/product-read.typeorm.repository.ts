import { ProductInStockDto } from '@/modules/kpi/application/dtos/product-in-stock.dto'
import { ProductReadRepository } from '@/modules/kpi/domain/repositories/product-read.repository'
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
export class ProductReadTypeOrmRepository implements ProductReadRepository {
  constructor(private readonly productRepo: Repository<ProductTypeOrmEntity>) {}

  async productsInStock(): Promise<ProductInStockDto[]> {
    const rawProducts = await this.productRepo
      .createQueryBuilder('product')
      .innerJoin(
        ProductModelTypeOrmEntity,
        'productModel',
        'productModel.id = product.productModelId'
      )
      .select('product.id', 'id')
      .addSelect('product.serialNumber', 'serialNumber')
      .addSelect('product.productModelId', 'modelId')
      .select('productModel.name', 'modelName')
      .addSelect('product.batchId', 'batchId')
      .addSelect('product.unitCost', 'unitCost')
      .addSelect('product.salePrice', 'salePrice')
      .addSelect('product.status', 'status')
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

  async totalProductsInStock(): Promise<number> {
    const products = await this.productRepo
      .createQueryBuilder('product')
      .where('product.status = :status', { status: ProductStatus.IN_STOCK })
      .getCount()
    return products
  }

  async totalProductsWithResellers(): Promise<number> {
    const products = await this.productRepo
      .createQueryBuilder('product')
      .where('product.status = :status', { status: ProductStatus.ASSIGNED })
      .getCount()
    return products
  }
}
