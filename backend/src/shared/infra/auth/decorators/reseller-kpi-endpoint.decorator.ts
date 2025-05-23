import { ResellerKpiControllerGuard } from '@/shared/infra/auth/guards/reseller-kpi-controller.guard'
import { JwtAuthGuard } from '@/shared/infra/auth/guards/jwt-auth.guard'
import { applyDecorators, UseGuards } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'

export const ResellerKpiEndpoint = () =>
  applyDecorators(
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, ResellerKpiControllerGuard)
  )
