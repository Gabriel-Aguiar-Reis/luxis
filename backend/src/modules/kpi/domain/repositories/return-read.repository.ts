import { ReturnDto } from '@/modules/kpi/application/dtos/return.dto'
import { ReturnsInPeriodDto } from '@/modules/kpi/application/dtos/returns-in-period.dto'
import { TotalReturnsByResellerDto } from '@/modules/kpi/application/dtos/total-returns-by-reseller.dto'
import { TotalReturnsInPeriodDto } from '@/modules/kpi/application/dtos/total-returns-in-period.dto'

export abstract class ReturnReadRepository {
  abstract ReturnsByReseller(): Promise<ReturnDto[]>
  abstract TotalReturnsByReseller(): Promise<TotalReturnsByResellerDto[]>
  abstract TotalReturnsInPeriod(
    start: Date,
    end: Date
  ): Promise<TotalReturnsInPeriodDto>
  abstract ReturnsInPeriod(start: Date, end: Date): Promise<ReturnsInPeriodDto>
}
