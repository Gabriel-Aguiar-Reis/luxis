import { Repository } from 'typeorm'
import { SaleTypeOrmEntity } from '@/shared/infra/persistence/typeorm/sale/sale.typeorm.entity'
import { ParamsWithMandatoryPeriodDto } from '@/shared/common/dtos/params-with-mandatory-period.dto'
import { baseWhere } from '@/shared/common/utils/query-builder.helper'
import { TotalBillingReturnDto } from '@/modules/kpi/admin/application/dtos/sale/total-billing-return.dto'

export async function totalBillingByPeriod(
  saleRepo: Repository<SaleTypeOrmEntity>,
  qParams: ParamsWithMandatoryPeriodDto
): Promise<TotalBillingReturnDto> {
  const qb = saleRepo
    .createQueryBuilder('sale')
    .select('SUM(sale.total_amount)', 'total')
  const filteredSales = baseWhere(qb, qParams, 'sale.sale_date')
  const result = await filteredSales.getRawOne<{ total: string }>()
  return {
    start: qParams.start,
    end: qParams.end,
    total: parseFloat(result?.total || '0')
  }
}
