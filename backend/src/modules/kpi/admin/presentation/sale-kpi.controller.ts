import { GetSalesInPeriodUseCase } from '@/modules/kpi/admin/application/use-cases/sale/get-sales-in-period-kpi.use-case'
import { GetTotalSalesInPeriodUseCase } from '@/modules/kpi/admin/application/use-cases/sale/get-total-sales-in-period-kpi.use-case'
import { Controller, Get, Query, Param, HttpCode } from '@nestjs/common'
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
import { CacheKey, CacheTTL } from '@nestjs/cache-manager'
import { ApiBody } from '@nestjs/swagger'
import { SalesInPeriodDto } from '@/modules/kpi/admin/application/dtos/sale/sales-in-period.dto'
import { GetSalesAggregatedByDayUseCase } from '@/modules/kpi/admin/application/use-cases/sale/get-sales-aggregated-by-day-kpi.use-case'
import { SalesAggregatedByDayDto } from '@/modules/kpi/admin/application/dtos/sale/sales-aggregated-by-day.dto'

@ApiTags('Admins KPIs - Sales')
@AdminKpiEndpoint()
@Controller('kpi/admin/sales')
export class AdminSaleKpiController {
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
    private readonly getTotalBillingInPeriodUseCase: GetTotalBillingInPeriodUseCase,
    private readonly getSalesAggregatedByDayUseCase: GetSalesAggregatedByDayUseCase
  ) {}

  @ApiOperation({
    summary: 'Get Sales By Reseller Id',
    operationId: 'getSalesByResellerId'
  })
  @ApiBody({ type: ParamsDto })
  @ApiResponse({
    status: 200,
    description: 'List of reseller sales returned successfully',
    type: [SalesByResellerDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CacheTTL(60)
  @CacheKey('sales-by-reseller-id')
  @HttpCode(200)
  @Get('resellers/:id')
  async getSalesByResellerId(
    @Param('id') id: UUID,
    @Query() qParams: ParamsDto
  ) {
    this.logger.log('Get Sales By Reseller Id', 'AdminKpiController')
    return this.getSalesByResellerIdUseCase.execute(id, qParams)
  }

  @ApiOperation({
    summary: 'Get Total Sales By Reseller Id',
    operationId: 'getTotalSalesByResellerId'
  })
  @ApiBody({ type: ParamsDto })
  @ApiResponse({
    status: 200,
    description: 'Total sales by reseller returned successfully',
    type: TotalSalesByResellerDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CacheTTL(60)
  @CacheKey('total-sales-by-reseller-id')
  @HttpCode(200)
  @Get('resellers/:id/total')
  async getTotalSalesByResellerId(
    @Param('id') id: UUID,
    @Query() qParams: ParamsDto
  ) {
    this.logger.log('Get Total Sales By Reseller Id', 'AdminKpiController')
    return this.getTotalSalesByResellerIdUseCase.execute(id, qParams)
  }

  @ApiOperation({
    summary: 'Get Sales In Period',
    operationId: 'getSalesInPeriod'
  })
  @ApiBody({ type: ParamsWithMandatoryPeriodDto })
  @ApiResponse({
    status: 200,
    description: 'Sales in period returned successfully',
    type: SalesInPeriodDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CacheTTL(60)
  @CacheKey('sales-in-period')
  @HttpCode(200)
  @Get()
  async getSalesInPeriod(@Query() qParams: ParamsWithMandatoryPeriodDto) {
    this.logger.log('Get Sales In Period', 'AdminKpiController')
    return this.getSalesInPeriodUseCase.execute(qParams)
  }

  @ApiOperation({
    summary: 'Get Total Sales In Period',
    operationId: 'getTotalSalesInPeriod'
  })
  @ApiBody({ type: ParamsWithMandatoryPeriodDto })
  @ApiResponse({
    status: 200,
    description: 'Total sales in period returned successfully',
    type: TotalSalesInPeriodDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CacheTTL(60)
  @CacheKey('total-sales-in-period')
  @HttpCode(200)
  @Get('total')
  async getTotalSalesInPeriod(@Query() qParams: ParamsWithMandatoryPeriodDto) {
    this.logger.log('Get Total Sales In Period', 'AdminKpiController')
    return this.getTotalSalesInPeriodUseCase.execute(qParams)
  }

  @ApiOperation({
    summary: 'Get Sales Aggregated By Day',
    operationId: 'getSalesAggregatedByDay'
  })
  @ApiBody({ type: ParamsWithMandatoryPeriodDto })
  @ApiResponse({
    status: 200,
    description: 'Sales aggregated by day returned successfully',
    type: SalesAggregatedByDayDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CacheTTL(60)
  @CacheKey('sales-aggregated-by-day')
  @HttpCode(200)
  @Get('aggregated-by-day')
  async getSalesAggregatedByDay(
    @Query() qParams: ParamsWithMandatoryPeriodDto
  ) {
    this.logger.log('Get Sales Aggregated By Day', 'AdminKpiController')
    return this.getSalesAggregatedByDayUseCase.execute(qParams)
  }

  @ApiOperation({
    summary: 'Get Sales By Reseller',
    operationId: 'getSalesByReseller'
  })
  @ApiBody({ type: ParamsDto })
  @ApiResponse({
    status: 200,
    description: 'List of reseller sales returned successfully',
    type: [SalesByResellerDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CacheTTL(60)
  @CacheKey('sales-by-reseller')
  @HttpCode(200)
  @Get('resellers')
  async getSalesByReseller(@Query() qParams: ParamsDto) {
    this.logger.log('Get Sales By Reseller', 'AdminKpiController')
    return this.getSalesByResellerUseCase.execute(qParams)
  }

  @ApiOperation({
    summary: 'Get Total Sales By Reseller',
    operationId: 'getTotalSalesByReseller'
  })
  @ApiBody({ type: ParamsDto })
  @ApiResponse({
    status: 200,
    description: 'Total sales by reseller returned successfully',
    type: TotalSalesByResellerDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CacheTTL(60)
  @CacheKey('total-sales-by-reseller')
  @HttpCode(200)
  @Get('resellers/total')
  async getTotalSalesByReseller(@Query() qParams: ParamsDto) {
    this.logger.log('Get Total Sales By Reseller', 'AdminKpiController')
    return this.getTotalSalesByResellerUseCase.execute(qParams)
  }

  @ApiOperation({
    summary: 'Get Total Billing By Batch Id',
    operationId: 'getTotalBillingByBatchId'
  })
  @ApiResponse({
    status: 200,
    description: 'Total billing by batch ID returned successfully',
    type: TotalBillingReturnDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CacheTTL(60)
  @CacheKey('total-billing-by-batch-id')
  @HttpCode(200)
  @Get('billing/batch/:id')
  async getTotalBillingByBatchId(@Param('id') id: UUID) {
    this.logger.log('Get Total Billing By Batch Id', 'AdminKpiController')
    return this.getTotalBillingByBatchIdUseCase.execute(id)
  }

  @ApiOperation({
    summary: 'Get Total Billing By Reseller Id',
    operationId: 'getTotalBillingByResellerId'
  })
  @ApiBody({ type: ParamsWithMandatoryPeriodDto })
  @ApiResponse({
    status: 200,
    description: 'Total billing by reseller ID returned successfully',
    type: TotalBillingReturnDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CacheTTL(60)
  @CacheKey('total-billing-by-reseller-id')
  @HttpCode(200)
  @Get('billing/resellers/:resellerId')
  async getTotalBillingByResellerId(
    @Param('resellerId') resellerId: UUID,
    @Query() qParams: ParamsWithMandatoryPeriodDto
  ): Promise<TotalBillingReturnDto> {
    this.logger.log('Get Total Billing By Reseller Id', 'AdminKpiController')
    return this.getTotalBillingByResellerIdUseCase.execute(resellerId, qParams)
  }

  @ApiOperation({
    summary: 'Get Total Billing By Period',
    operationId: 'getTotalBillingByPeriod'
  })
  @ApiBody({ type: ParamsWithMandatoryPeriodDto })
  @ApiResponse({
    status: 200,
    description: 'Total billing by period returned successfully',
    type: TotalBillingReturnDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CacheTTL(60)
  @CacheKey('total-billing-by-period')
  @HttpCode(200)
  @Get('billing/period')
  async getTotalBillingByPeriod(
    @Query() qParams: ParamsWithMandatoryPeriodDto
  ): Promise<TotalBillingReturnDto> {
    this.logger.log('Get Total Billing By Period', 'AdminKpiController')
    return this.getTotalBillingInPeriodUseCase.execute(qParams)
  }
}
