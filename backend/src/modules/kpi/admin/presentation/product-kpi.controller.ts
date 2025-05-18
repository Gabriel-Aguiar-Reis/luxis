import { Controller, Get } from '@nestjs/common'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GetTotalProductsInStockUseCase } from '@/modules/kpi/admin/application/use-cases/product/get-total-products-in-stock-kpi.use-case'
import { GetTotalProductWithResellersUseCase } from '@/modules/kpi/admin/application/use-cases/product/get-total-products-with-resellers-kpi.use-case'
import { GetProductsInStockUseCase } from '@/modules/kpi/admin/application/use-cases/product/get-products-in-stock-kpi.use-case'
import { ProductInStockDto } from '@/modules/kpi/admin/application/dtos/product/product-in-stock.dto'
import { ProductWithResellerDto } from '@/modules/kpi/admin/application/dtos/product/product-with-reseller.dto'
import { AdminKpiEndpoint } from '@/shared/infra/auth/decorators/admin-kpi-endpoint.decorator'

@ApiTags('Admins KPIs - Products')
@AdminKpiEndpoint()
@Controller('kpi/admin/products')
export class ResellerKpiController {
  constructor(
    private readonly logger: CustomLogger,
    private readonly getProductsInStockUseCase: GetProductsInStockUseCase,
    private readonly getTotalProductsInStockUseCase: GetTotalProductsInStockUseCase,
    private readonly getTotalProductWithResellersUseCase: GetTotalProductWithResellersUseCase
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
  @Get('in-stock')
  async getProductsInStock() {
    this.logger.log('Get Products In Stock', 'AdminKpiController')
    return this.getProductsInStockUseCase.execute()
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
  async getProductsWithResellers() {
    this.logger.log('Get Products With Resellers', 'AdminKpiController')
    return this.getTotalProductWithResellersUseCase.execute()
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
  async getTotalProductsWithResellers() {
    this.logger.log('Get Total Products With Resellers', 'AdminKpiController')
    return this.getTotalProductWithResellersUseCase.execute()
  }
}
