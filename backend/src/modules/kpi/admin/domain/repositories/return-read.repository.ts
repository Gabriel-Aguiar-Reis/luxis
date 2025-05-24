import { ReturnByResellerDto } from '@/modules/kpi/admin/application/dtos/return/return-by-reseller.dto'
import { ReturnsInPeriodDto } from '@/modules/kpi/admin/application/dtos/return/returns-in-period.dto'
import { TotalReturnsByResellerDto } from '@/modules/kpi/admin/application/dtos/return/total-returns-by-reseller.dto'
import { TotalReturnsInPeriodDto } from '@/modules/kpi/admin/application/dtos/return/total-returns-in-period.dto'
import { ParamsWithMandatoryPeriodDto } from '@/shared/common/dtos/params-with-mandatory-period.dto'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { UUID } from 'crypto'

export abstract class ReturnReadRepository {
  abstract ReturnsByResellerId(
    resellerId: UUID,
    qParams: ParamsDto
  ): Promise<ReturnByResellerDto>
  abstract TotalReturnsByResellerId(
    resellerId: UUID,
    qParams: ParamsDto
  ): Promise<TotalReturnsByResellerDto>
  abstract ReturnsByReseller(qParams: ParamsDto): Promise<ReturnByResellerDto[]>
  abstract TotalReturnsByReseller(
    qParams: ParamsDto
  ): Promise<TotalReturnsByResellerDto[]>
  abstract ReturnsInPeriod(
    qParams: ParamsWithMandatoryPeriodDto
  ): Promise<ReturnsInPeriodDto>
  abstract TotalReturnsInPeriod(
    qParams: ParamsWithMandatoryPeriodDto
  ): Promise<TotalReturnsInPeriodDto>
}
