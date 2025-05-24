import { Controller, Get, Body } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { GetMonthlySalesUseCase } from '@/modules/kpi/reseller/application/use-cases/sale/get-monthly-sales.use-case'
import { GetAverageTicketUseCase } from '@/modules/kpi/reseller/application/use-cases/sale/get-average-ticket.use-case'
import { MonthlySalesDto } from '@/modules/kpi/reseller/application/dtos/sale/monthly-sales.dto'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { CurrentUser } from '@/shared/infra/auth/decorators/current-user.decorator'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { CacheKey, CacheTTL } from '@nestjs/cache-manager'
import { ResellerKpiEndpoint } from '@/shared/infra/auth/decorators/reseller-kpi-endpoint.decorator'

@ApiTags('Reseller KPIs - Sales')
@ResellerKpiEndpoint()
@Controller('kpi/my-space/sales')
export class ResellerSaleKpiController {
  constructor(
    private readonly getMonthlySalesUseCase: GetMonthlySalesUseCase,
    private readonly getAverageTicketUseCase: GetAverageTicketUseCase,
    private readonly logger: CustomLogger
  ) {}

  @ApiOperation({ summary: 'Get monthly sales for a reseller' })
  @ApiBody({ type: ParamsDto })
  @ApiResponse({
    status: 200,
    description: 'Monthly sales returned successfully',
    type: [MonthlySalesDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CacheKey('monthly-sales')
  @CacheTTL(300)
  @Get('monthly')
  async getMonthlySales(
    @Body() qParams: ParamsDto,
    @CurrentUser() user: UserPayload
  ): Promise<MonthlySalesDto[]> {
    this.logger.log(
      `Getting monthly sales - Requested by user ${user.email}`,
      'ResellerSaleKpiController'
    )
    return this.getMonthlySalesUseCase.execute(user.id, qParams)
  }

  @ApiOperation({ summary: 'Get average ticket for a reseller' })
  @ApiBody({ type: ParamsDto })
  @ApiResponse({
    status: 200,
    type: Number,
    description: 'Average ticket value'
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CacheKey('average-ticket')
  @CacheTTL(300)
  @Get('average-ticket')
  async getAverageTicket(
    @CurrentUser() user: UserPayload,
    @Body() qParams: ParamsDto
  ): Promise<number> {
    this.logger.log(
      `Getting average ticket - Requested by user ${user.email}`,
      'ResellerSaleKpiController'
    )
    return this.getAverageTicketUseCase.execute(user.id, qParams)
  }
}
