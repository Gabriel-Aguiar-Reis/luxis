import { Body, Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { GetCurrentInventoryUseCase } from '@/modules/kpi/reseller/application/use-cases/inventory/get-current-inventory.use-case'
import { InventoryProductModelDto } from '@/modules/kpi/reseller/application/dtos/inventory/inventory-product-model.dto'
import { CurrentUser } from '@/shared/infra/auth/decorators/current-user.decorator'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { CacheTTL, CacheKey } from '@nestjs/cache-manager'
import { ResellerKpiEndpoint } from '@/shared/infra/auth/decorators/reseller-kpi-endpoint.decorator'
import { CustomLogger } from '@/shared/infra/logging/logger.service'

@ApiTags('Reseller KPIs - Inventory')
@ResellerKpiEndpoint()
@Controller('my-space/kpis/inventory')
export class ResellerInventoryKpiController {
  constructor(
    private readonly logger: CustomLogger,
    private readonly getCurrentInventoryUseCase: GetCurrentInventoryUseCase
  ) {}

  @Get('current')
  @ApiOperation({ summary: 'Get current inventory for a reseller' })
  @ApiResponse({ status: 200, type: [InventoryProductModelDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CacheKey('current-inventory')
  @CacheTTL(300)
  async getCurrentInventory(
    @CurrentUser() user: UserPayload,
    @Body() qParams: ParamsDto
  ): Promise<InventoryProductModelDto[]> {
    this.logger.log(
      `Getting current inventory - Requested by user ${user.email}`,
      'ResellerInventoryKpiController'
    )
    return this.getCurrentInventoryUseCase.execute(user.id, qParams)
  }
}
