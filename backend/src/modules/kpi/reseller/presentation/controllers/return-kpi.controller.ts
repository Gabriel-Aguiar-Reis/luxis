import { Controller, Body, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { GetReturnsMadeByResellerUseCase } from '@/modules/kpi/reseller/application/use-cases/return/get-returns-made-by-reseller.use-case'
import { CurrentUser } from '@/shared/infra/auth/decorators/current-user.decorator'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { CacheKey, CacheTTL } from '@nestjs/cache-manager'
import { ResellerKpiEndpoint } from '@/shared/infra/auth/decorators/reseller-kpi-endpoint.decorator'
import { CustomLogger } from '@/shared/infra/logging/logger.service'

@ApiTags('Reseller KPIs - Returns')
@ResellerKpiEndpoint()
@Controller('kpi/my-space/returns')
export class ResellerReturnKpiController {
  constructor(
    private readonly logger: CustomLogger,
    private readonly getReturnsMadeByResellerUseCase: GetReturnsMadeByResellerUseCase
  ) {}

  @ApiOperation({ summary: 'Get number of returns made by a reseller' })
  @ApiBody({ type: ParamsDto })
  @ApiResponse({ status: 200, type: Number, description: 'Number of returns' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CacheKey('returns-count')
  @CacheTTL(300)
  @Post('count')
  async getReturnsMadeByReseller(
    @CurrentUser() user: UserPayload,
    @Body() qParams: ParamsDto
  ): Promise<number> {
    this.logger.log(
      `Getting returns count - Requested by user ${user.email}`,
      'ResellerReturnKpiController'
    )
    return this.getReturnsMadeByResellerUseCase.execute(user.id, qParams)
  }
}
