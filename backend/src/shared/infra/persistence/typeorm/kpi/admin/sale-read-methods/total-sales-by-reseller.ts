import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { Repository } from 'typeorm'
import { SaleTypeOrmEntity } from '@/shared/infra/persistence/typeorm/sale/sale.typeorm.entity'
import { UserTypeOrmEntity } from '@/shared/infra/persistence/typeorm/user/user.typeorm.entity'
import { baseWhere } from '@/shared/common/utils/query-builder.helper'
import { TotalSalesByResellerDto } from '@/modules/kpi/admin/application/dtos/sale/total-sales-by-reseller.dto'

export async function totalSalesByReseller(
  saleRepo: Repository<SaleTypeOrmEntity>,
  qParams: ParamsDto
): Promise<TotalSalesByResellerDto[]> {
  const qb = saleRepo
    .createQueryBuilder('sale')
    .innerJoin(UserTypeOrmEntity, 'user', 'user.id = sale.resellerId')
    .select([
      'user.id as "resellerId"',
      `CONCAT(user.name, ' ', user.surname) as "resellerName"`,
      'COUNT(sale.id) as "salesCount"'
    ])
    .groupBy('user.id, user.name, user.surname')
  const filteredSales = baseWhere(qb, qParams, 'sale.sale_date')
  const rawResult = await filteredSales.getRawMany<TotalSalesByResellerDto>()
  return rawResult.map((row) => ({
    resellerId: row.resellerId,
    resellerName: row.resellerName,
    salesCount: Number(row.salesCount)
  }))
}
