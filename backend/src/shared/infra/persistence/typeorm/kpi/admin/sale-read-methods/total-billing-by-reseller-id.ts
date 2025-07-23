import { UUID } from 'crypto'
import { Repository } from 'typeorm'
import { SaleTypeOrmEntity } from '@/shared/infra/persistence/typeorm/sale/sale.typeorm.entity'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { ParamsWithMandatoryPeriodDto } from '@/shared/common/dtos/params-with-mandatory-period.dto'
import { baseWhere } from '@/shared/common/utils/query-builder.helper'
import { TotalBillingReturnDto } from '@/modules/kpi/admin/application/dtos/sale/total-billing-return.dto'

export async function totalBillingByResellerId(
  saleRepo: Repository<SaleTypeOrmEntity>,
  resellerId: UUID,
  qParams: ParamsWithMandatoryPeriodDto
): Promise<TotalBillingReturnDto> {
  const qb = saleRepo
    .createQueryBuilder('sale')
    .innerJoin(ProductTypeOrmEntity, 'product', 'product.id = sale.product_id')
    .where('sale.reseller_id = :resellerId', { resellerId })
    .select('SUM(sale.total_amount)', 'total')
  const filteredSales = baseWhere(qb, qParams, 'sale.sale_date')
  const result = await filteredSales.getRawOne<{ total: string }>()
  return {
    start: qParams.start,
    end: qParams.end,
    total: parseFloat(result?.total || '0')
  }
}
