import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { ProductInStockDto } from '@/modules/kpi/admin/application/dtos/product/product-in-stock.dto'
import { ProductWithResellerDto } from '@/modules/kpi/admin/application/dtos/product/product-with-reseller.dto'
import { ProductReadRepository } from '@/modules/kpi/admin/domain/repositories/product-read.repository'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { productsWithResellers } from '@/shared/infra/persistence/typeorm/kpi/admin/product-read-methods/products-with-resellers'
import { totalProductsWithResellers } from '@/shared/infra/persistence/typeorm/kpi/admin/product-read-methods/total-products-with-resellers'
import { productsInStock } from '@/shared/infra/persistence/typeorm/kpi/admin/product-read-methods/products-in-stock'
import { totalProductsInStock } from '@/shared/infra/persistence/typeorm/kpi/admin/product-read-methods/total-products-in-stock'
import { productsInStockForMoreThanXDays } from '@/shared/infra/persistence/typeorm/kpi/admin/product-read-methods/products-in-stock-for-more-than-x-days'
import { totalProductsInStockForMoreThanXDays } from '@/shared/infra/persistence/typeorm/kpi/admin/product-read-methods/total-products-in-stock-for-more-than-x-days'

export class ProductReadTypeormRepository implements ProductReadRepository {
  constructor(
    @InjectRepository(ProductTypeOrmEntity)
    private readonly productRepo: Repository<ProductTypeOrmEntity>
  ) {}

  async productsWithResellers(
    qParams: ParamsDto
  ): Promise<ProductWithResellerDto[]> {
    return productsWithResellers(this.productRepo, qParams)
  }

  totalProductsWithResellers(qParams: ParamsDto): Promise<number> {
    return totalProductsWithResellers(this.productRepo, qParams)
  }

  async productsInStock(qParams: ParamsDto): Promise<ProductInStockDto[]> {
    return productsInStock(this.productRepo, qParams)
  }

  async totalProductsInStock(qParams: ParamsDto): Promise<number> {
    return totalProductsInStock(this.productRepo, qParams)
  }

  async productsInStockForMoreThanXDays(
    days: number,
    qParams: ParamsDto
  ): Promise<ProductInStockDto[]> {
    return productsInStockForMoreThanXDays(this.productRepo, days, qParams)
  }

  async totalProductsInStockForMoreThanXDays(
    days: number,
    qParams: ParamsDto
  ): Promise<number> {
    return totalProductsInStockForMoreThanXDays(this.productRepo, days, qParams)
  }
}
