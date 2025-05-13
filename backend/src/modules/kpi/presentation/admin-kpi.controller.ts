import { GetTotalSalesInPeriodUseCase } from './../application/use-cases/admin/get-total-sales-in-period-kpi'
import { Controller, Get, Body, Param, UseGuards } from '@nestjs/common'
import { UUID } from 'crypto'
import { JwtAuthGuard } from '@/shared/infra/auth/guards/jwt-auth.guard'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth
} from '@nestjs/swagger'
import { GetResellerSalesUseCase } from '@/modules/kpi/application/use-cases/admin/get-sales-by-reseller-kpi'
import { AdminKpiControllerGuard } from '@/shared/infra/auth/guards/admin-kpi-controller.guard'
import { GetTotalProductsInStockUseCase } from '@/modules/kpi/application/use-cases/admin/get-total-products-in-stock-kpi'
import { TotalSalesInPeriodDto } from '@/modules/kpi/application/dtos/total-sales-in-period.dto'
import { TotalSalesByResellerDto } from '@/modules/kpi/application/dtos/total-sales-by-reseller.dto'
import { GetTotalSalesByResellerUseCase } from '@/modules/kpi/application/use-cases/admin/get-total-sales-by-reseller-kpi'
import { GetTotalProductWithResellersUseCase } from '@/modules/kpi/application/use-cases/admin/get-total-products-with-resellers-kpi'
import { SalesByResellerDto } from '@/modules/kpi/application/dtos/sales-by-reseller.dto'
import { GetProductsInStockUseCase } from '@/modules/kpi/application/use-cases/admin/get-products-in-stock-kpi'
import { ProductInStockDto } from '@/modules/kpi/application/dtos/product-in-stock.dto'

@ApiTags('Admins KPIs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminKpiControllerGuard)
@Controller('kpi/admin')
export class AdminKpiController {
  constructor(
    private readonly logger: CustomLogger,
    private readonly getResellerSalesUseCase: GetResellerSalesUseCase,
    private readonly getTotalProductsInStockUseCase: GetTotalProductsInStockUseCase,
    private readonly GetTotalSalesInPeriodUseCase: GetTotalSalesInPeriodUseCase,
    private readonly getTotalSalesByResellerUseCase: GetTotalSalesByResellerUseCase,
    private readonly getTotalProductWithResellersUseCase: GetTotalProductWithResellersUseCase,
    private readonly getProductsInStockUseCase: GetProductsInStockUseCase
  ) {}

  @ApiOperation({ summary: 'Get Resellers sales' })
  @ApiResponse({
    status: 200,
    description: 'List of resellers sales returned successfully',
    type: [SalesByResellerDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Get()
  @Get('resellers/:id/sales')
  async getResellerSales(@Param('id') id: UUID) {
    this.logger.log('Get Reseller Sales', 'AdminKpiController')
    return this.getResellerSalesUseCase.execute(id)
  }

  @ApiOperation({ summary: 'Get Total Products In Stock' })
  @ApiResponse({
    status: 200,
    description: 'Total products in stock returned successfully',
    type: Number
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Get('products/in-stock/total')
  async getTotalProductsInStock() {
    this.logger.log('Get Total Products In Stock', 'AdminKpiController')
    return this.getTotalProductsInStockUseCase.execute()
  }

  @ApiOperation({ summary: 'Get Products In Stock' })
  @ApiResponse({
    status: 200,
    description: 'List of products in stock returned successfully',
    type: [ProductInStockDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Get('products/in-stock')
  async getProductsInStock() {
    this.logger.log('Get Products In Stock', 'AdminKpiController')
    return this.getProductsInStockUseCase.execute()
  }

  @ApiOperation({ summary: 'Get Total Products With Resellers' })
  @ApiResponse({
    status: 200,
    description: 'Total products with resellers returned successfully',
    type: Number
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Get('products/with-resellers/total')
  async getTotalProductsWithResellers() {
    this.logger.log('Get Total Products With Resellers', 'AdminKpiController')
    return this.getTotalProductWithResellersUseCase.execute()
  }

  @ApiOperation({ summary: 'Get Total Sales In Period' })
  @ApiResponse({
    status: 200,
    description: 'Total sales in period returned successfully',
    type: TotalSalesInPeriodDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Get('sales/total')
  async getTotalSalesInPeriod(
    @Body('start') start: Date,
    @Body('end') end: Date
  ) {
    this.logger.log('Get Total Sales In Period', 'AdminKpiController')
    return this.GetTotalSalesInPeriodUseCase.execute(start, end)
  }

  @ApiOperation({ summary: 'Get Total Sales By Reseller' })
  @ApiResponse({
    status: 200,
    description: 'Total sales by reseller returned successfully',
    type: TotalSalesByResellerDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Get('sales/total/resellers')
  async getTotalSalesByReseller() {
    this.logger.log('Get Total Sales By Reseller', 'AdminKpiController')
    return this.getTotalSalesByResellerUseCase.execute()
  }
}
