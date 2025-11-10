import { GetInventoryByIdReturnDto } from "@/modules/inventory/application/dtos/get-inventory-by-id-return.dto"
import { GetInventoryByIdUseCase } from "@/modules/inventory/application/use-cases/get-inventory-by-id.use-case"
import { CheckPolicies } from "@/shared/infra/auth/decorators/check-policies.decorator"
import { CurrentUser } from "@/shared/infra/auth/decorators/current-user.decorator"
import { JwtAuthGuard } from "@/shared/infra/auth/guards/jwt-auth.guard"
import { PoliciesGuard } from "@/shared/infra/auth/guards/policies.guard"
import { UserPayload } from "@/shared/infra/auth/interfaces/user-payload.interface"
import { ReadInventoryPolicy } from "@/shared/infra/auth/policies/inventory/read-inventory.policy"
import { CustomLogger } from "@/shared/infra/logging/logger.service"
import { UseGuards, Controller, Get, HttpCode, Param } from "@nestjs/common"
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger"
import { UUID } from "crypto"

@ApiTags('Inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly getInventoryByIdUseCase: GetInventoryByIdUseCase,
    private readonly logger: CustomLogger
  ) { }
  
  @ApiOperation({
    summary: 'Get inventory by ID',
    operationId: 'getInventoryById'
  })
  @ApiResponse({
    status: 200,
    description: 'Inventory returned successfully',
    type: GetInventoryByIdReturnDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new ReadInventoryPolicy())
  @HttpCode(200)
  @Get(':id')
  async getAll(
    @CurrentUser() user: UserPayload,
    @Param('id') id: UUID
  ): Promise<GetInventoryByIdReturnDto> {
    this.logger.log(
      `Getting inventory for reseller ${id} - Requested by user ${user.email}`,
      'InventoryController'
    )
    return await this.getInventoryByIdUseCase.execute(id, user)
  }
}