import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { Repository } from 'typeorm'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { BatchTypeOrmEntity } from '@/shared/infra/persistence/typeorm/batch/batch.typeorm.entity'
import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
import { baseWhere } from '@/shared/common/utils/query-builder.helper'

export async function totalProductsInStockForMoreThanXDays(
  productRepo: Repository<ProductTypeOrmEntity>,
  days: number,
  qParams: ParamsDto
): Promise<number> {
  const qb = productRepo
    .createQueryBuilder('product')
    .innerJoin(BatchTypeOrmEntity, 'batch', 'batch.id = product.batch_id')
    .where('product.status = :status', { status: ProductStatus.IN_STOCK })
    .andWhere(`batch.arrival_date < NOW() - INTERVAL '${days} days'`)

  const filteredProducts = baseWhere(qb, qParams, 'product.created_at')
  return filteredProducts.getCount()
}
