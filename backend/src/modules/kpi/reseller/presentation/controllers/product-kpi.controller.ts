import { Controller, Get, Body } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { GetTopSellingProductsUseCase } from '@/modules/kpi/reseller/application/use-cases/product/get-top-selling-products.use-case'
import { GetProductsWithLongestTimeInInventoryUseCase } from '@/modules/kpi/reseller/application/use-cases/product/get-products-with-longest-time-in-inventory.use-case'
import { SellingProductDto } from '@/modules/kpi/reseller/application/dtos/product/selling-product.dto'
import { ProductInInventoryDto } from '@/modules/kpi/reseller/application/dtos/product/product-in-inventory.dto'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { CurrentUser } from '@/shared/infra/auth/decorators/current-user.decorator'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { CacheKey, CacheTTL } from '@nestjs/cache-manager'
import { ResellerKpiEndpoint } from '@/shared/infra/auth/decorators/reseller-kpi-endpoint.decorator'

@ApiTags('Reseller KPIs - Products')
@ResellerKpiEndpoint()
@Controller('kpi/my-space/products')
export class ResellerProductKpiController {
  constructor(
    private readonly logger: CustomLogger,
    private readonly getTopSellingProductsUseCase: GetTopSellingProductsUseCase,
    private readonly getProductsWithLongestTimeInInventoryUseCase: GetProductsWithLongestTimeInInventoryUseCase
  ) {}

  @ApiOperation({ summary: 'Get top selling products for a reseller' })
  @ApiBody({ type: ParamsDto })
  @ApiResponse({ status: 200, type: [SellingProductDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CacheKey('top-selling-products')
  @CacheTTL(300)
  @Get('top-selling')
  async getTopSellingProducts(
    @CurrentUser() user: UserPayload,
    @Body() qParams: ParamsDto
  ): Promise<SellingProductDto[]> {
    this.logger.log(
      `Getting top selling products - Requested by user ${user.email}`,
      'ResellerProductKpiController'
    )
    return this.getTopSellingProductsUseCase.execute(user.id, qParams)
  }

  @ApiOperation({
    summary: 'Get products with longest time in inventory for a reseller'
  })
  @ApiBody({ type: ParamsDto })
  @ApiResponse({ status: 200, type: [ProductInInventoryDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CacheKey('products-with-longest-time-in-inventory')
  @CacheTTL(300)
  @Get('longest-time-in-inventory')
  async getProductsWithLongestTimeInInventory(
    @CurrentUser() user: UserPayload,
    @Body() qParams: ParamsDto
  ): Promise<ProductInInventoryDto[]> {
    this.logger.log(
      `Getting products with longest time in inventory - Requested by user ${user.email}`,
      'ResellerProductKpiController'
    )
    return this.getProductsWithLongestTimeInInventoryUseCase.execute(
      user.id,
      qParams
    )
  }
}
