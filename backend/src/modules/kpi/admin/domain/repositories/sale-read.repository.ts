import { SalesByResellerDto } from '@/modules/kpi/admin/application/dtos/sale/sales-by-reseller.dto'
import { SalesInPeriodDto } from '@/modules/kpi/admin/application/dtos/sale/sales-in-period.dto'
import { TotalSalesByResellerDto } from '@/modules/kpi/admin/application/dtos/sale/total-sales-by-reseller.dto'
import { TotalSalesInPeriodDto } from '@/modules/kpi/admin/application/dtos/sale/total-sales-in-period.dto'
import { UUID } from 'crypto'

export abstract class SaleReadRepository {
  abstract salesByResellerId(
    resellerId: UUID,
    start?: Date,
    end?: Date
  ): Promise<SalesByResellerDto>
  abstract totalSalesByResellerId(
    resellerId: UUID,
    start?: Date,
    end?: Date
  ): Promise<TotalSalesByResellerDto>
  abstract salesInPeriod(start: Date, end: Date): Promise<SalesInPeriodDto>
  abstract totalSalesInPeriod(
    start: Date,
    end: Date
  ): Promise<TotalSalesInPeriodDto>
  abstract salesByReseller(
    start?: Date,
    end?: Date
  ): Promise<SalesByResellerDto[]>
  abstract totalSalesByReseller(
    start?: Date,
    end?: Date
  ): Promise<TotalSalesByResellerDto[]>
}
