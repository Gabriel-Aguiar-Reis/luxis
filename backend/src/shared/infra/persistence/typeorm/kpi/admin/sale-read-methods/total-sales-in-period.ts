import { ParamsWithMandatoryPeriodDto } from '@/shared/common/dtos/params-with-mandatory-period.dto'
import { Repository } from 'typeorm'
import { SaleTypeOrmEntity } from '@/shared/infra/persistence/typeorm/sale/sale.typeorm.entity'
import { baseWhere } from '@/shared/common/utils/query-builder.helper'
import { TotalSalesInPeriodDto } from '@/modules/kpi/admin/application/dtos/sale/total-sales-in-period.dto'

export async function totalSalesInPeriod(
  saleRepo: Repository<SaleTypeOrmEntity>,
  qParams: ParamsWithMandatoryPeriodDto
): Promise<TotalSalesInPeriodDto> {
  const qb = saleRepo.createQueryBuilder('sale')
  const filteredSales = baseWhere(qb, qParams, 'sale.sale_date')
  const totalSales = await filteredSales.getCount()
  return { start: qParams.start, end: qParams.end, totalSales }
}
