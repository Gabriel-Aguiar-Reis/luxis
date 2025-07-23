import { UUID } from 'crypto'
import { Repository } from 'typeorm'
import { SaleTypeOrmEntity } from '@/shared/infra/persistence/typeorm/sale/sale.typeorm.entity'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { BatchTypeOrmEntity } from '@/shared/infra/persistence/typeorm/batch/batch.typeorm.entity'
import { TotalBillingReturnDto } from '@/modules/kpi/admin/application/dtos/sale/total-billing-return.dto'

export async function totalBillingByBatchId(
  saleRepo: Repository<SaleTypeOrmEntity>,
  batchId: UUID
): Promise<TotalBillingReturnDto> {
  const result = await saleRepo
    .createQueryBuilder('sale')
    .innerJoin(ProductTypeOrmEntity, 'product', 'product.id = sale.product_id')
    .innerJoin(BatchTypeOrmEntity, 'batch', 'batch.id = product.batch_id')
    .where('batch.id = :batchId', { batchId })
    .select('SUM(sale.total_amount)', 'total')
    .getRawOne<{ total: string }>()
  return {
    start: new Date(0),
    end: new Date(),
    total: parseFloat(result?.total || '0')
  }
}
