import { ProductReadRepository } from '@/modules/kpi/domain/repositories/product-read.repository'
import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { Repository } from 'typeorm'

export class ProductReadTypeOrmRepository implements ProductReadRepository {
  constructor(private readonly productRepo: Repository<ProductTypeOrmEntity>) {}

  async totalProductsInStock(): Promise<number> {
    const products = await this.productRepo
      .createQueryBuilder('product')
      .where('product.status = :status', { status: ProductStatus.IN_STOCK })
      .getMany()
    return products.length
  }

  async totalProductsWithResellers(): Promise<number> {
    const products = await this.productRepo
      .createQueryBuilder('product')
      .where('product.status = :status', { status: ProductStatus.ASSIGNED })
      .getMany()
    return products.length
  }
}
