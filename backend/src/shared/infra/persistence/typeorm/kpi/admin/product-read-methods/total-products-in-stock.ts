import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { Repository } from 'typeorm'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
import { baseWhere } from '@/shared/common/utils/query-builder.helper'

export async function totalProductsInStock(
  productRepo: Repository<ProductTypeOrmEntity>,
  qParams: ParamsDto
): Promise<number> {
  const qb = productRepo
    .createQueryBuilder('product')
    .where('product.status = :status', { status: ProductStatus.IN_STOCK })
  const filteredProducts = baseWhere(qb, qParams, 'product.created_at')
  return filteredProducts.getCount()
}
