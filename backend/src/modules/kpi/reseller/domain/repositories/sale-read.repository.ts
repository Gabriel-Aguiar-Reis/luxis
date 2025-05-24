import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { UUID } from 'crypto'
import { MonthlySalesDto } from '@/modules/kpi/reseller/application/dtos/sale/monthly-sales.dto'

export abstract class SaleReadRepository {
  abstract monthlySales(
    resellerId: UUID,
    qParams: ParamsDto
  ): Promise<MonthlySalesDto[]>
  abstract averageTicket(resellerId: UUID, qParams: ParamsDto): Promise<number>
}
