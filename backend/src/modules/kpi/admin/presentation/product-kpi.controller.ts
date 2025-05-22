import { Body, Controller, Get, Param } from '@nestjs/common'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GetTotalProductsInStockUseCase } from '@/modules/kpi/admin/application/use-cases/product/get-total-products-in-stock-kpi.use-case'
import { GetTotalProductWithResellersUseCase } from '@/modules/kpi/admin/application/use-cases/product/get-total-products-with-resellers-kpi.use-case'
import { GetProductsInStockUseCase } from '@/modules/kpi/admin/application/use-cases/product/get-products-in-stock-kpi.use-case'
import { GetProductsInStockForMoreThanXDaysUseCase } from '@/modules/kpi/admin/application/use-cases/product/get-products-in-stock-for-more-than-x-days-kpi.use-case'
import { GetTotalProductsInStockForMoreThanXDaysUseCase } from '@/modules/kpi/admin/application/use-cases/product/get-total-products-in-stock-for-more-than-x-days-kpi.use-case'
import { ProductInStockDto } from '@/modules/kpi/admin/application/dtos/product/product-in-stock.dto'
import { ProductWithResellerDto } from '@/modules/kpi/admin/application/dtos/product/product-with-reseller.dto'
import { AdminKpiEndpoint } from '@/shared/infra/auth/decorators/admin-kpi-endpoint.decorator'
import { ParamsDto } from '@/shared/common/dtos/params.dto'

@ApiTags('Admins KPIs - Products')
@AdminKpiEndpoint()
@Controller('kpi/admin/products')
export class ResellerKpiController {
  constructor(
    private readonly logger: CustomLogger,
    private readonly getProductsInStockUseCase: GetProductsInStockUseCase,
    private readonly getTotalProductsInStockUseCase: GetTotalProductsInStockUseCase,
    private readonly getTotalProductWithResellersUseCase: GetTotalProductWithResellersUseCase,
    private readonly getProductsInStockForMoreThanXDaysUseCase: GetProductsInStockForMoreThanXDaysUseCase,
    private readonly getTotalProductsInStockForMoreThanXDaysUseCase: GetTotalProductsInStockForMoreThanXDaysUseCase
  ) {}

  @ApiOperation({ summary: 'Get Total Products In Stock' })
  @ApiResponse({
    status: 200,
    description: 'Total products in stock returned successfully',
    type: Number
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Get('in-stock/total')
  async getTotalProductsInStock(@Body() qParams: ParamsDto) {
    this.logger.log('Get Total Products In Stock', 'AdminKpiController')
    return this.getTotalProductsInStockUseCase.execute(qParams)
  }

  @ApiOperation({ summary: 'Get Products In Stock' })
  @ApiResponse({
    status: 200,
    description: 'List of products in stock returned successfully',
    type: [ProductInStockDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Get('in-stock')
  async getProductsInStock(@Body() qParams: ParamsDto) {
    this.logger.log('Get Products In Stock', 'AdminKpiController')
    return this.getProductsInStockUseCase.execute(qParams)
  }

  @ApiOperation({ summary: 'Get Products With Resellers' })
  @ApiResponse({
    status: 200,
    description: 'List of products with resellers returned successfully',
    type: [ProductWithResellerDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Get('with-resellers')
  async getProductsWithResellers(@Body() qParams: ParamsDto) {
    this.logger.log('Get Products With Resellers', 'AdminKpiController')
    return this.getTotalProductWithResellersUseCase.execute(qParams)
  }

  @ApiOperation({ summary: 'Get Total Products With Resellers' })
  @ApiResponse({
    status: 200,
    description: 'Total products with resellers returned successfully',
    type: Number
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Get('with-resellers/total')
  async getTotalProductsWithResellers(@Body() qParams: ParamsDto) {
    this.logger.log('Get Total Products With Resellers', 'AdminKpiController')
    return this.getTotalProductWithResellersUseCase.execute(qParams)
  }

  @ApiOperation({ summary: 'Get Products In Stock For More Than X Days' })
  @ApiResponse({
    status: 200,
    description:
      'List of products in stock for more than X days returned successfully',
    type: [ProductInStockDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Get('in-stock/for-more-than/:days')
  async getProductsInStockForMoreThanXDays(
    @Param('days') days: number,
    @Body() qParams: ParamsDto
  ) {
    this.logger.log(
      `Get Products In Stock For More Than ${days} Days`,
      'AdminKpiController'
    )
    return this.getProductsInStockForMoreThanXDaysUseCase.execute(days, qParams)
  }

  @ApiOperation({ summary: 'Get Total Products In Stock For More Than X Days' })
  @ApiResponse({
    status: 200,
    description:
      'Total products in stock for more than X days returned successfully',
    type: Number
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Get('in-stock/for-more-than/:days/total')
  async getTotalProductsInStockForMoreThanXDays(
    @Param('days') days: number,
    @Body() qParams: ParamsDto
  ) {
    this.logger.log(
      `Get Total Products In Stock For More Than ${days} Days`,
      'AdminKpiController'
    )
    return this.getTotalProductsInStockForMoreThanXDaysUseCase.execute(
      days,
      qParams
    )
  }
}
