import { ParamsWithMandatoryPeriodDto } from '@/shared/common/dtos/params-with-mandatory-period.dto'
import { Repository } from 'typeorm'
import { SaleTypeOrmEntity } from '@/shared/infra/persistence/typeorm/sale/sale.typeorm.entity'
import { baseWhere } from '@/shared/common/utils/query-builder.helper'

export async function salesAggregatedByDay(
  saleRepo: Repository<SaleTypeOrmEntity>,
  qParams: ParamsWithMandatoryPeriodDto
): Promise<{
  start: Date
  end: Date
  data: Array<{
    date: string
    sales: number
    totalAmount: string
  }>
}> {
  const qb = saleRepo
    .createQueryBuilder('sale')
    .select([
      `DATE(sale.sale_date) as "date"`,
      `COUNT(sale.id)::int as "sales"`,
      `SUM(sale.total_amount)::decimal(10,2) as "totalAmount"`
    ])
    .groupBy('DATE(sale.sale_date)')
    .orderBy('DATE(sale.sale_date)', 'ASC')

  const filteredSales = baseWhere(qb, qParams, 'sale.sale_date')

  const result = await filteredSales.getRawMany<{
    date: string
    sales: number
    totalAmount: string
  }>()

  return {
    start: qParams.start,
    end: qParams.end,
    data: result
  }
}
