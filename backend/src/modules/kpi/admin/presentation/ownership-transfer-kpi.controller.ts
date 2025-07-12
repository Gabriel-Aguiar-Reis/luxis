import { Query, Controller, Param, Get } from '@nestjs/common'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { ApiOperation, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AdminKpiEndpoint } from '@/shared/infra/auth/decorators/admin-kpi-endpoint.decorator'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { ParamsWithMandatoryPeriodDto } from '@/shared/common/dtos/params-with-mandatory-period.dto'
import { GetOwnershipTransfersByResellerIdKpiUseCase } from '@/modules/kpi/admin/application/use-cases/ownership-transfer/get-ownership-transfers-by-reseller-id-kpi.use-case'
import { GetTotalOwnershipTransfersByResellerIdKpiUseCase } from '@/modules/kpi/admin/application/use-cases/ownership-transfer/get-total-ownership-transfers-by-reseller-id-kpi.use-case'
import { GetOwnershipTransfersInPeriodKpiUseCase } from '@/modules/kpi/admin/application/use-cases/ownership-transfer/get-ownership-transfers-in-period-kpi.use-case'
import { GetTotalOwnershipTransfersInPeriodKpiUseCase } from '@/modules/kpi/admin/application/use-cases/ownership-transfer/get-total-ownership-transfers-in-period-kpi.use-case'
import { GetOwnershipTransfersReceivedByResellerIdKpiUseCase } from '@/modules/kpi/admin/application/use-cases/ownership-transfer/get-ownership-transfers-received-by-reseller-id-kpi.use-case'
import { GetTotalOwnershipTransfersReceivedByResellerIdKpiUseCase } from '@/modules/kpi/admin/application/use-cases/ownership-transfer/get-total-ownership-transfers-received-by-reseller-id-kpi.use-case'
import { GetOwnershipTransfersGivenByResellerIdKpiUseCase } from '@/modules/kpi/admin/application/use-cases/ownership-transfer/get-ownership-transfers-given-by-reseller-id-kpi.use-case'
import { GetTotalOwnershipTransfersGivenByResellerIdKpiUseCase } from '@/modules/kpi/admin/application/use-cases/ownership-transfer/get-total-ownership-transfers-given-by-reseller-id-kpi.use-case'
import { UUID } from 'crypto'

@ApiTags('Admins KPIs - Ownership Transfers')
@AdminKpiEndpoint()
@Controller('kpi/admin/ownership-transfers')
export class AdminOwnershipTransferKpiController {
  constructor(
    private readonly logger: CustomLogger,
    private readonly getOwnershipTransfersByResellerIdUseCase: GetOwnershipTransfersByResellerIdKpiUseCase,
    private readonly getTotalOwnershipTransfersByResellerIdUseCase: GetTotalOwnershipTransfersByResellerIdKpiUseCase,
    private readonly getOwnershipTransfersInPeriodUseCase: GetOwnershipTransfersInPeriodKpiUseCase,
    private readonly getTotalOwnershipTransfersInPeriodUseCase: GetTotalOwnershipTransfersInPeriodKpiUseCase,
    private readonly getOwnershipTransfersReceivedByResellerIdUseCase: GetOwnershipTransfersReceivedByResellerIdKpiUseCase,
    private readonly getTotalOwnershipTransfersReceivedByResellerIdUseCase: GetTotalOwnershipTransfersReceivedByResellerIdKpiUseCase,
    private readonly getOwnershipTransfersGivenByResellerIdUseCase: GetOwnershipTransfersGivenByResellerIdKpiUseCase,
    private readonly getTotalOwnershipTransfersGivenByResellerIdUseCase: GetTotalOwnershipTransfersGivenByResellerIdKpiUseCase
  ) {}

  @ApiOperation({
    summary: 'Get Ownership Transfers By Reseller Id',
    operationId: 'getOwnershipTransfersByResellerId'
  })
  @ApiBody({ type: ParamsDto })
  @ApiResponse({
    status: 200,
    description: 'Ownership transfers by reseller returned successfully',
    type: Object
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Get('by-reseller/:id')
  async getOwnershipTransfersByResellerId(
    @Param('id') id: UUID,
    @Query() qParams: ParamsDto
  ) {
    this.logger.log(
      'Get Ownership Transfers By Reseller Id',
      'AdminOwnershipTransferKpiController'
    )
    return this.getOwnershipTransfersByResellerIdUseCase.execute(
      id as UUID,
      qParams
    )
  }

  @ApiOperation({
    summary: 'Get Total Ownership Transfers By Reseller Id',
    operationId: 'getTotalOwnershipTransfersByResellerId'
  })
  @ApiBody({ type: ParamsDto })
  @ApiResponse({
    status: 200,
    description: 'Total ownership transfers by reseller returned successfully',
    type: Number
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Get('by-reseller/:id/total')
  async getTotalOwnershipTransfersByResellerId(
    @Param('id') id: UUID,
    @Query() qParams: ParamsDto
  ) {
    this.logger.log(
      'Get Total Ownership Transfers By Reseller Id',
      'AdminOwnershipTransferKpiController'
    )
    return this.getTotalOwnershipTransfersByResellerIdUseCase.execute(
      id as UUID,
      qParams
    )
  }

  @ApiOperation({
    summary: 'Get Ownership Transfers In Period',
    operationId: 'getOwnershipTransfersInPeriod'
  })
  @ApiBody({ type: ParamsWithMandatoryPeriodDto })
  @ApiResponse({
    status: 200,
    description: 'Ownership transfers in period returned successfully',
    type: Object
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Get('in-period')
  async getOwnershipTransfersInPeriod(
    @Query() qParams: ParamsWithMandatoryPeriodDto
  ) {
    this.logger.log(
      'Get Ownership Transfers In Period',
      'AdminOwnershipTransferKpiController'
    )
    return this.getOwnershipTransfersInPeriodUseCase.execute(qParams)
  }

  @ApiOperation({
    summary: 'Get Total Ownership Transfers In Period',
    operationId: 'getTotalOwnershipTransfersInPeriod'
  })
  @ApiBody({ type: ParamsWithMandatoryPeriodDto })
  @ApiResponse({
    status: 200,
    description: 'Total ownership transfers in period returned successfully',
    type: Number
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Get('in-period/total')
  async getTotalOwnershipTransfersInPeriod(
    @Query() qParams: ParamsWithMandatoryPeriodDto
  ) {
    this.logger.log(
      'Get Total Ownership Transfers In Period',
      'AdminOwnershipTransferKpiController'
    )
    return this.getTotalOwnershipTransfersInPeriodUseCase.execute(qParams)
  }

  @ApiOperation({
    summary: 'Get Ownership Transfers Received By Reseller Id',
    operationId: 'getOwnershipTransfersReceivedByResellerId'
  })
  @ApiBody({ type: ParamsDto })
  @ApiResponse({
    status: 200,
    description:
      'Ownership transfers received by reseller returned successfully',
    type: Object
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Get('received/by-reseller/:id')
  async getOwnershipTransfersReceivedByResellerId(
    @Param('id') id: UUID,
    @Query() qParams: ParamsDto
  ) {
    this.logger.log(
      'Get Ownership Transfers Received By Reseller Id',
      'AdminOwnershipTransferKpiController'
    )
    return this.getOwnershipTransfersReceivedByResellerIdUseCase.execute(
      id as UUID,
      qParams
    )
  }

  @ApiOperation({
    summary: 'Get Total Ownership Transfers Received By Reseller Id',
    operationId: 'getTotalOwnershipTransfersReceivedByResellerId'
  })
  @ApiBody({ type: ParamsDto })
  @ApiResponse({
    status: 200,
    description:
      'Total ownership transfers received by reseller returned successfully',
    type: Number
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Get('received/by-reseller/:id/total')
  async getTotalOwnershipTransfersReceivedByResellerId(
    @Param('id') id: UUID,
    @Query() qParams: ParamsDto
  ) {
    this.logger.log(
      'Get Total Ownership Transfers Received By Reseller Id',
      'AdminOwnershipTransferKpiController'
    )
    return this.getTotalOwnershipTransfersReceivedByResellerIdUseCase.execute(
      id as UUID,
      qParams
    )
  }

  @ApiOperation({
    summary: 'Get Ownership Transfers Given By Reseller Id',
    operationId: 'getOwnershipTransfersGivenByResellerId'
  })
  @ApiBody({ type: ParamsDto })
  @ApiResponse({
    status: 200,
    description: 'Ownership transfers given by reseller returned successfully',
    type: Object
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Get('given/by-reseller/:id')
  async getOwnershipTransfersGivenByResellerId(
    @Param('id') id: UUID,
    @Query() qParams: ParamsDto
  ) {
    this.logger.log(
      'Get Ownership Transfers Given By Reseller Id',
      'AdminOwnershipTransferKpiController'
    )
    return this.getOwnershipTransfersGivenByResellerIdUseCase.execute(
      id as UUID,
      qParams
    )
  }

  @ApiOperation({
    summary: 'Get Total Ownership Transfers Given By Reseller Id',
    operationId: 'getTotalOwnershipTransfersGivenByResellerId'
  })
  @ApiBody({ type: ParamsDto })
  @ApiResponse({
    status: 200,
    description:
      'Total ownership transfers given by reseller returned successfully',
    type: Number
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Get('given/by-reseller/:id/total')
  async getTotalOwnershipTransfersGivenByResellerId(
    @Param('id') id: UUID,
    @Query() qParams: ParamsDto
  ) {
    this.logger.log(
      'Get Total Ownership Transfers Given By Reseller Id',
      'AdminOwnershipTransferKpiController'
    )
    return this.getTotalOwnershipTransfersGivenByResellerIdUseCase.execute(
      id as UUID,
      qParams
    )
  }
}
