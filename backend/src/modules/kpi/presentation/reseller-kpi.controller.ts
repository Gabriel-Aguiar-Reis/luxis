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
import { AdminKpiControllerGuard } from '@/shared/infra/auth/guards/admin-kpi-controller.guard'

@ApiTags('Resellers KPIs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminKpiControllerGuard)
@Controller('kpi/Reseller')
export class ResellerKpiController {
  constructor(private readonly logger: CustomLogger) {}
  //   @ApiOperation({ summary: 'Get Resellers sales' })
  //   @ApiResponse({
  //     status: 200,
  //     description: 'List of resellers sales returned successfully',
  //     type: [SalesByReseller]
  //   })
  //   @ApiResponse({ status: 401, description: 'Unauthorized' })
  //   @ApiResponse({ status: 403, description: 'Access denied' })
  //   @Get()
  //   @Get('resellers/:id/sales')
  //   async getResellerSales(@Param('id') id: UUID) {
  //     this.logger.log('Get Reseller Sales', 'AdminKpiController')
  //     return this.getResellerSalesUseCase.execute(id)
  //   }
}
