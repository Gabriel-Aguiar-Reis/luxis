import { AdminKpiControllerGuard } from '@/shared/infra/auth/guards/admin-kpi-controller.guard'
import { JwtAuthGuard } from '@/shared/infra/auth/guards/jwt-auth.guard'
import { applyDecorators, UseGuards } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'

export const AdminKpiEndpoint = () =>
  applyDecorators(
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, AdminKpiControllerGuard)
  )
