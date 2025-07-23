import { Query, Controller, Param, Get } from '@nestjs/common'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { ApiOperation, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AdminKpiEndpoint } from '@/shared/infra/auth/decorators/admin-kpi-endpoint.decorator'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { ParamsWithMandatoryPeriodDto } from '@/shared/common/dtos/params-with-mandatory-period.dto'
import { GetReturnsByResellerIdKpiUseCase } from '@/modules/kpi/admin/application/use-cases/return/get-returns-by-reseller-id-kpi.use-case'
import { GetTotalReturnsByResellerIdKpiUseCase } from '@/modules/kpi/admin/application/use-cases/return/get-total-returns-by-reseller-id-kpi.use-case'
import { GetReturnsByResellerUseCase } from '@/modules/kpi/admin/application/use-cases/return/get-returns-by-reseller-kpi.use-case'
import { GetTotalReturnsByResellerUseCase } from '@/modules/kpi/admin/application/use-cases/return/get-total-returns-by-reseller-kpi.use-case'
import { GetReturnsInPeriodUseCase } from '@/modules/kpi/admin/application/use-cases/return/get-returns-in-period-kpi.use-case'
import { GetTotalReturnsInPeriodUseCase } from '@/modules/kpi/admin/application/use-cases/return/get-total-returns-in-period-kpi.use-case'
import { UUID } from 'crypto'
import { TotalReturnsInPeriodDto } from '@/modules/kpi/admin/application/dtos/return/total-returns-in-period.dto'
import { ReturnsInPeriodDto } from '@/modules/kpi/admin/application/dtos/return/returns-in-period.dto'

@ApiTags('Admins KPIs - Returns')
@AdminKpiEndpoint()
@Controller('kpi/admin/returns')
export class AdminReturnKpiController {
  constructor(
    private readonly logger: CustomLogger,
    private readonly getReturnsByResellerIdUseCase: GetReturnsByResellerIdKpiUseCase,
    private readonly getTotalReturnsByResellerIdUseCase: GetTotalReturnsByResellerIdKpiUseCase,
    private readonly getReturnsByResellerUseCase: GetReturnsByResellerUseCase,
    private readonly getTotalReturnsByResellerUseCase: GetTotalReturnsByResellerUseCase,
    private readonly getReturnsInPeriodUseCase: GetReturnsInPeriodUseCase,
    private readonly getTotalReturnsInPeriodUseCase: GetTotalReturnsInPeriodUseCase
  ) {}

  @ApiOperation({
    summary: 'Get Returns By Reseller Id',
    operationId: 'getReturnsByResellerId'
  })
  @ApiBody({ type: ParamsDto })
  @ApiResponse({
    status: 200,
    description: 'Returns by reseller returned successfully',
    type: Object
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Get('by-reseller/:id')
  async getReturnsByResellerId(
    @Param('id') id: string,
    @Query() qParams: ParamsDto
  ) {
    this.logger.log('Get Returns By Reseller Id', 'AdminReturnKpiController')
    return this.getReturnsByResellerIdUseCase.execute(id as UUID, qParams)
  }

  @ApiOperation({
    summary: 'Get Total Returns By Reseller Id',
    operationId: 'getTotalReturnsByResellerId'
  })
  @ApiBody({ type: ParamsDto })
  @ApiResponse({
    status: 200,
    description: 'Total returns by reseller returned successfully',
    type: Object
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Get('by-reseller/:id/total')
  async getTotalReturnsByResellerId(
    @Param('id') id: string,
    @Query() qParams: ParamsDto
  ) {
    this.logger.log(
      'Get Total Returns By Reseller Id',
      'AdminReturnKpiController'
    )
    return this.getTotalReturnsByResellerIdUseCase.execute(id as UUID, qParams)
  }

  @ApiOperation({
    summary: 'Get Returns By Reseller',
    operationId: 'getReturnsByReseller'
  })
  @ApiBody({ type: ParamsDto })
  @ApiResponse({
    status: 200,
    description: 'Returns by reseller returned successfully',
    type: Object
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Get('by-reseller')
  async getReturnsByReseller(@Query() qParams: ParamsDto) {
    this.logger.log('Get Returns By Reseller', 'AdminReturnKpiController')
    return this.getReturnsByResellerUseCase.execute(qParams)
  }

  @ApiOperation({
    summary: 'Get Total Returns By Reseller',
    operationId: 'getTotalReturnsByReseller'
  })
  @ApiBody({ type: ParamsDto })
  @ApiResponse({
    status: 200,
    description: 'Total returns by reseller returned successfully',
    type: Object
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Get('by-reseller/total')
  async getTotalReturnsByReseller(@Query() qParams: ParamsDto) {
    this.logger.log('Get Total Returns By Reseller', 'AdminReturnKpiController')
    return this.getTotalReturnsByResellerUseCase.execute(qParams)
  }

  @ApiOperation({
    summary: 'Get Returns In Period',
    operationId: 'getReturnsInPeriod'
  })
  @ApiBody({ type: ParamsWithMandatoryPeriodDto })
  @ApiResponse({
    status: 200,
    description: 'Returns in period returned successfully',
    type: ReturnsInPeriodDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Get('in-period')
  async getReturnsInPeriod(@Query() qParams: ParamsWithMandatoryPeriodDto) {
    this.logger.log('Get Returns In Period', 'AdminReturnKpiController')
    return this.getReturnsInPeriodUseCase.execute(qParams)
  }

  @ApiOperation({
    summary: 'Get Total Returns In Period',
    operationId: 'getTotalReturnsInPeriod'
  })
  @ApiBody({ type: ParamsWithMandatoryPeriodDto })
  @ApiResponse({
    status: 200,
    description: 'Total returns in period returned successfully',
    type: TotalReturnsInPeriodDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Get('in-period/total')
  async getTotalReturnsInPeriod(
    @Query() qParams: ParamsWithMandatoryPeriodDto
  ) {
    this.logger.log('Get Total Returns In Period', 'AdminReturnKpiController')
    return this.getTotalReturnsInPeriodUseCase.execute(qParams)
  }
}
