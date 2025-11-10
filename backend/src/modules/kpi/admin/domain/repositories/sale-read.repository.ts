import { SalesByResellerDto } from '@/modules/kpi/admin/application/dtos/sale/sales-by-reseller.dto'
import { SalesInPeriodDto } from '@/modules/kpi/admin/application/dtos/sale/sales-in-period.dto'
import { TotalBillingReturnDto } from '@/modules/kpi/admin/application/dtos/sale/total-billing-return.dto'
import { TotalSalesByResellerDto } from '@/modules/kpi/admin/application/dtos/sale/total-sales-by-reseller.dto'
import { TotalSalesInPeriodDto } from '@/modules/kpi/admin/application/dtos/sale/total-sales-in-period.dto'
import { ParamsWithMandatoryPeriodDto } from '@/shared/common/dtos/params-with-mandatory-period.dto'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { UUID } from 'crypto'
import { SalesAggregatedByDayDto } from '@/modules/kpi/admin/application/dtos/sale/sales-aggregated-by-day.dto'

export abstract class SaleReadRepository {
  abstract salesByResellerId(
    resellerId: UUID,
    qParams: ParamsDto
  ): Promise<SalesByResellerDto>
  abstract totalSalesByResellerId(
    resellerId: UUID,
    qParams: ParamsDto
  ): Promise<TotalSalesByResellerDto>
  abstract salesInPeriod(
    qParams: ParamsWithMandatoryPeriodDto
  ): Promise<SalesInPeriodDto>
  abstract totalSalesInPeriod(
    qParams: ParamsWithMandatoryPeriodDto
  ): Promise<TotalSalesInPeriodDto>
  abstract salesByReseller(qParams: ParamsDto): Promise<SalesByResellerDto[]>
  abstract totalSalesByReseller(
    qParams: ParamsDto
  ): Promise<TotalSalesByResellerDto[]>
  abstract totalBillingByBatchId(batchId: UUID): Promise<TotalBillingReturnDto>
  abstract totalBillingByResellerId(
    resellerId: UUID,
    qParams: ParamsDto
  ): Promise<TotalBillingReturnDto>
  abstract totalBillingByPeriod(
    qParams: ParamsWithMandatoryPeriodDto
  ): Promise<TotalBillingReturnDto>
  abstract salesAggregatedByDay(
    qParams: ParamsWithMandatoryPeriodDto
  ): Promise<SalesAggregatedByDayDto>
}
