import { SalesByResellerDto } from '@/modules/kpi/application/dtos/sales-by-reseller.dto'
import { TotalSalesByResellerDto } from '@/modules/kpi/application/dtos/total-sales-by-reseller.dto'
import { TotalSalesInPeriodDto } from '@/modules/kpi/application/dtos/total-sales-in-period.dto'
import { UUID } from 'crypto'

export abstract class SaleReadRepository {
  abstract salesByResellerId(resellerId: UUID): Promise<SalesByResellerDto>
  abstract totalSalesInPeriod(
    start: Date,
    end: Date
  ): Promise<TotalSalesInPeriodDto>
  abstract totalSalesByReseller(): Promise<TotalSalesByResellerDto[]>
  // abstract topSellers(
  //   limit: number
  // ): Promise<{ resellerId: UUID; total: number }[]>
}
