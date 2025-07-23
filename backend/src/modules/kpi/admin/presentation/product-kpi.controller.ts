import { Query, Controller, Param, Get } from '@nestjs/common'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { ApiOperation, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GetTotalProductsInStockUseCase } from '@/modules/kpi/admin/application/use-cases/product/get-total-products-in-stock-kpi.use-case'
import { GetTotalProductWithResellersUseCase } from '@/modules/kpi/admin/application/use-cases/product/get-total-products-with-resellers-kpi.use-case'
import { GetProductsInStockUseCase } from '@/modules/kpi/admin/application/use-cases/product/get-products-in-stock-kpi.use-case'
import { GetProductsInStockForMoreThanXDaysUseCase } from '@/modules/kpi/admin/application/use-cases/product/get-products-in-stock-for-more-than-x-days-kpi.use-case'
import { GetTotalProductsInStockForMoreThanXDaysUseCase } from '@/modules/kpi/admin/application/use-cases/product/get-total-products-in-stock-for-more-than-x-days-kpi.use-case'
import { ProductInStockDto } from '@/modules/kpi/admin/application/dtos/product/product-in-stock.dto'
import { ProductWithResellerDto } from '@/modules/kpi/admin/application/dtos/product/product-with-reseller.dto'
import { AdminKpiEndpoint } from '@/shared/infra/auth/decorators/admin-kpi-endpoint.decorator'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { CacheKey, CacheTTL } from '@nestjs/cache-manager'

@ApiTags('Admins KPIs - Products')
@AdminKpiEndpoint()
@Controller('kpi/admin/products')
export class AdminProductKpiController {
  constructor(
    private readonly logger: CustomLogger,
    private readonly getProductsInStockUseCase: GetProductsInStockUseCase,
    private readonly getTotalProductsInStockUseCase: GetTotalProductsInStockUseCase,
    private readonly getTotalProductWithResellersUseCase: GetTotalProductWithResellersUseCase,
    private readonly getProductsInStockForMoreThanXDaysUseCase: GetProductsInStockForMoreThanXDaysUseCase,
    private readonly getTotalProductsInStockForMoreThanXDaysUseCase: GetTotalProductsInStockForMoreThanXDaysUseCase
  ) {}

  @ApiOperation({
    summary: 'Get Total Products In Stock',
    operationId: 'getTotalProductsInStock'
  })
  @ApiBody({ type: ParamsDto })
  @ApiResponse({
    status: 200,
    description: 'Total products in stock returned successfully',
    type: Number
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CacheTTL(60)
  @CacheKey('total-products-in-stock')
  @Get('in-stock/total')
  async getTotalProductsInStock(@Query() qParams: ParamsDto) {
    this.logger.log('Get Total Products In Stock', 'AdminKpiController')
    return this.getTotalProductsInStockUseCase.execute(qParams)
  }

  @ApiOperation({
    summary: 'Get Products In Stock',
    operationId: 'getProductsInStock'
  })
  @ApiBody({ type: ParamsDto })
  @ApiResponse({
    status: 200,
    description: 'List of products in stock returned successfully',
    type: [ProductInStockDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CacheTTL(60)
  @CacheKey('products-in-stock')
  @Get('in-stock')
  async getProductsInStock(@Query() qParams: ParamsDto) {
    this.logger.log('Get Products In Stock', 'AdminKpiController')
    return this.getProductsInStockUseCase.execute(qParams)
  }

  @ApiOperation({
    summary: 'Get Products With Resellers',
    operationId: 'getProductsWithResellers'
  })
  @ApiBody({ type: ParamsDto })
  @ApiResponse({
    status: 200,
    description: 'List of products with resellers returned successfully',
    type: [ProductWithResellerDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CacheTTL(60)
  @CacheKey('products-with-resellers')
  @Get('with-resellers')
  async getProductsWithResellers(@Query() qParams: ParamsDto) {
    this.logger.log('Get Products With Resellers', 'AdminKpiController')
    return this.getTotalProductWithResellersUseCase.execute(qParams)
  }

  @ApiOperation({
    summary: 'Get Total Products With Resellers',
    operationId: 'getTotalProductsWithResellers'
  })
  @ApiBody({ type: ParamsDto })
  @ApiResponse({
    status: 200,
    description: 'Total products with resellers returned successfully',
    type: Number
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CacheTTL(60)
  @CacheKey('total-products-with-resellers')
  @Get('with-resellers/total')
  async getTotalProductsWithResellers(@Query() qParams: ParamsDto) {
    this.logger.log('Get Total Products With Resellers', 'AdminKpiController')
    return this.getTotalProductWithResellersUseCase.execute(qParams)
  }

  @ApiOperation({
    summary: 'Get Products In Stock For More Than X Days',
    operationId: 'getProductsInStockForMoreThanXDays'
  })
  @ApiBody({ type: ParamsDto })
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
    @Query() qParams: ParamsDto
  ) {
    this.logger.log(
      `Get Products In Stock For More Than ${days} Days`,
      'AdminKpiController'
    )
    return this.getProductsInStockForMoreThanXDaysUseCase.execute(days, qParams)
  }

  @ApiOperation({
    summary: 'Get Total Products In Stock For More Than X Days',
    operationId: 'getTotalProductsInStockForMoreThanXDays'
  })
  @ApiBody({ type: ParamsDto })
  @ApiResponse({
    status: 200,
    description:
      'Total products in stock for more than X days returned successfully',
    type: Number
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CacheTTL(60)
  @CacheKey('total-products-in-stock-for-more-than-x-days')
  @Get('in-stock/for-more-than/:days/total')
  async getTotalProductsInStockForMoreThanXDays(
    @Param('days') days: number,
    @Query() qParams: ParamsDto
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
