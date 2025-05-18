import { ReturnByResellerDto } from '@/modules/kpi/admin/application/dtos/return/return-by-reseller.dto'
import { ReturnsInPeriodDto } from '@/modules/kpi/admin/application/dtos/return/returns-in-period.dto'
import { TotalReturnsByResellerDto } from '@/modules/kpi/admin/application/dtos/return/total-returns-by-reseller.dto'
import { TotalReturnsInPeriodDto } from '@/modules/kpi/admin/application/dtos/return/total-returns-in-period.dto'
import { UUID } from 'crypto'

export abstract class ReturnReadRepository {
  abstract ReturnsByResellerId(
    resellerId: UUID,
    start?: Date,
    end?: Date
  ): Promise<ReturnByResellerDto>
  abstract TotalReturnsByResellerId(
    resellerId: UUID,
    start?: Date,
    end?: Date
  ): Promise<TotalReturnsByResellerDto>
  abstract ReturnsByReseller(
    start?: Date,
    end?: Date
  ): Promise<ReturnByResellerDto[]>
  abstract TotalReturnsByReseller(
    start?: Date,
    end?: Date
  ): Promise<TotalReturnsByResellerDto[]>
  abstract ReturnsInPeriod(start: Date, end: Date): Promise<ReturnsInPeriodDto>
  abstract TotalReturnsInPeriod(
    start: Date,
    end: Date
  ): Promise<TotalReturnsInPeriodDto>
}
