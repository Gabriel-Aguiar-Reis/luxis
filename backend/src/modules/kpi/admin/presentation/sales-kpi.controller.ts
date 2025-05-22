import { GetSalesInPeriodUseCase } from '@/modules/kpi/admin/application/use-cases/sale/get-sales-in-period-kpi.use-case'
import { GetTotalSalesInPeriodUseCase } from '@/modules/kpi/admin/application/use-cases/sale/get-total-sales-in-period-kpi.use-case'
import { Controller, Get, Body, Param } from '@nestjs/common'
import { UUID } from 'crypto'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GetSalesByResellerIdUseCase } from '@/modules/kpi/admin/application/use-cases/sale/get-sales-by-reseller-id-kpi.use-case'
import { TotalSalesInPeriodDto } from '@/modules/kpi/admin/application/dtos/sale/total-sales-in-period.dto'
import { TotalSalesByResellerDto } from '@/modules/kpi/admin/application/dtos/sale/total-sales-by-reseller.dto'
import { GetTotalSalesByResellerUseCase } from '@/modules/kpi/admin/application/use-cases/sale/get-total-sales-by-reseller-kpi.use-case'
import { SalesByResellerDto } from '@/modules/kpi/admin/application/dtos/sale/sales-by-reseller.dto'
import { GetTotalSalesByResellerIdUseCase } from '@/modules/kpi/admin/application/use-cases/sale/get-total-sales-by-reseller-id-kpi.use-case'
import { AdminKpiEndpoint } from '@/shared/infra/auth/decorators/admin-kpi-endpoint.decorator'
import { GetSalesByResellerUseCase } from '@/modules/kpi/admin/application/use-cases/sale/get-sales-by-reseller-kpi.use-case'
import { GetTotalBillingByResellerIdUseCase } from '@/modules/kpi/admin/application/use-cases/sale/get-total-billing-by-reseller-id-kpi.use-case'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { ParamsWithMandatoryPeriodDto } from '@/shared/common/dtos/params-with-mandatory-period.dto'
import { TotalBillingReturnDto } from '@/modules/kpi/admin/application/dtos/sale/total-billing-return.dto'
import { GetTotalBillingByBatchIdUseCase } from '@/modules/kpi/admin/application/use-cases/sale/get-total-billing-by-batch-id-kpi.use-case'
import { GetTotalBillingInPeriodUseCase } from '@/modules/kpi/admin/application/use-cases/sale/get-total-billing-in-period-kpi.use-case'

@ApiTags('Admins KPIs - Sales')
@AdminKpiEndpoint()
@Controller('kpi/admin/sales')
export class SalesKpiController {
  constructor(
    private readonly logger: CustomLogger,
    private readonly getSalesByResellerIdUseCase: GetSalesByResellerIdUseCase,
    private readonly getTotalSalesByResellerIdUseCase: GetTotalSalesByResellerIdUseCase,
    private readonly getSalesInPeriodUseCase: GetSalesInPeriodUseCase,
    private readonly getTotalSalesInPeriodUseCase: GetTotalSalesInPeriodUseCase,
    private readonly getSalesByResellerUseCase: GetSalesByResellerUseCase,
    private readonly getTotalSalesByResellerUseCase: GetTotalSalesByResellerUseCase,
    private readonly getTotalBillingByBatchIdUseCase: GetTotalBillingByBatchIdUseCase,
    private readonly getTotalBillingByResellerIdUseCase: GetTotalBillingByResellerIdUseCase,
    private readonly getTotalBillingInPeriodUseCase: GetTotalBillingInPeriodUseCase
  ) {}

  @ApiOperation({ summary: 'Get Sales By Reseller Id' })
  @ApiResponse({
    status: 200,
    description: 'List of reseller sales returned successfully',
    type: [SalesByResellerDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Get()
  @Get('resellers/:id')
  async getSalesByResellerId(
    @Param('id') id: UUID,
    @Body() qParams: ParamsDto
  ) {
    this.logger.log('Get Sales By Reseller Id', 'AdminKpiController')
    return this.getSalesByResellerIdUseCase.execute(id, qParams)
  }

  @ApiOperation({ summary: 'Get Total Sales By Reseller Id' })
  @ApiResponse({
    status: 200,
    description: 'Total sales by reseller returned successfully',
    type: TotalSalesByResellerDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Get('resellers/:id/total')
  async getTotalSalesByResellerId(
    @Param('id') id: UUID,
    @Body() qParams: ParamsDto
  ) {
    this.logger.log('Get Total Sales By Reseller Id', 'AdminKpiController')
    return this.getTotalSalesByResellerIdUseCase.execute(id, qParams)
  }

  @ApiOperation({ summary: 'Get Sales In Period' })
  @ApiResponse({
    status: 200,
    description: 'Sales in period returned successfully',
    type: SalesByResellerDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Get()
  async getSalesInPeriod(@Body() qParams: ParamsWithMandatoryPeriodDto) {
    this.logger.log('Get Sales In Period', 'AdminKpiController')
    return this.getSalesInPeriodUseCase.execute(qParams)
  }

  @ApiOperation({ summary: 'Get Total Sales In Period' })
  @ApiResponse({
    status: 200,
    description: 'Total sales in period returned successfully',
    type: TotalSalesInPeriodDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Get('total')
  async getTotalSalesInPeriod(@Body() qParams: ParamsWithMandatoryPeriodDto) {
    this.logger.log('Get Total Sales In Period', 'AdminKpiController')
    return this.getTotalSalesInPeriodUseCase.execute(qParams)
  }

  @ApiOperation({ summary: 'Get Sales By Reseller' })
  @ApiResponse({
    status: 200,
    description: 'List of reseller sales returned successfully',
    type: [SalesByResellerDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Get('resellers')
  async getSalesByReseller(@Body() qParams: ParamsDto) {
    this.logger.log('Get Sales By Reseller', 'AdminKpiController')
    return this.getSalesByResellerUseCase.execute(qParams)
  }

  @ApiOperation({ summary: 'Get Total Sales By Reseller' })
  @ApiResponse({
    status: 200,
    description: 'Total sales by reseller returned successfully',
    type: TotalSalesByResellerDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Get('resellers/total')
  async getTotalSalesByReseller(@Body() qParams: ParamsDto) {
    this.logger.log('Get Total Sales By Reseller', 'AdminKpiController')
    return this.getTotalSalesByResellerUseCase.execute(qParams)
  }

  @ApiOperation({ summary: 'Get Total Billing By Batch Id' })
  @ApiResponse({
    status: 200,
    description: 'Total billing by batch ID returned successfully',
    type: TotalBillingReturnDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Get('billing/batch/:id')
  async getTotalBillingByBatchId(@Param('id') id: UUID) {
    this.logger.log('Get Total Billing By Batch Id', 'AdminKpiController')
    return this.getTotalBillingByBatchIdUseCase.execute(id)
  }

  @Get('billing/resellers/:resellerId')
  async getTotalBillingByResellerId(): Promise<TotalBillingReturnDto> {
    throw new Error('Method not implemented.')
  }

  @Get('billing/period')
  async getTotalBillingByPeriod(
    @Body() qParams: ParamsWithMandatoryPeriodDto
  ): Promise<TotalBillingReturnDto> {
    throw new Error('Method not implemented.')
  }
}
