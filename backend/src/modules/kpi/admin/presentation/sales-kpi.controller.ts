import { GetSalesInPeriodUseCase } from '../application/use-cases/sale/get-sales-in-period-kpi.use-case'
import { GetTotalSalesInPeriodUseCase } from '../application/use-cases/sale/get-total-sales-in-period-kpi.use-case'
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
    private readonly getTotalSalesByResellerUseCase: GetTotalSalesByResellerUseCase
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
    @Body('start') start: Date,
    @Body('end') end: Date
  ) {
    this.logger.log('Get Sales By Reseller Id', 'AdminKpiController')
    return this.getSalesByResellerIdUseCase.execute(id, start, end)
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
    @Body('start') start: Date,
    @Body('end') end: Date
  ) {
    this.logger.log('Get Total Sales By Reseller Id', 'AdminKpiController')
    return this.getTotalSalesByResellerIdUseCase.execute(id, start, end)
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
  async getSalesInPeriod(@Body('start') start: Date, @Body('end') end: Date) {
    this.logger.log('Get Sales In Period', 'AdminKpiController')
    return this.getSalesInPeriodUseCase.execute(start, end)
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
  async getTotalSalesInPeriod(
    @Body('start') start: Date,
    @Body('end') end: Date
  ) {
    this.logger.log('Get Total Sales In Period', 'AdminKpiController')
    return this.getTotalSalesInPeriodUseCase.execute(start, end)
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
  async getSalesByReseller(@Body('start') start: Date, @Body('end') end: Date) {
    this.logger.log('Get Sales By Reseller', 'AdminKpiController')
    return this.getSalesByResellerUseCase.execute(start, end)
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
  async getTotalSalesByReseller() {
    this.logger.log('Get Total Sales By Reseller', 'AdminKpiController')
    return this.getTotalSalesByResellerUseCase.execute()
  }
}
