import { CreateShipmentUseCase } from '@/modules/shipment/application/use-cases/create-shipment.use-case'
import { DeleteShipmentUseCase } from '@/modules/shipment/application/use-cases/delete-shipment.use-case'
import { GetAllShipmentUseCase } from '@/modules/shipment/application/use-cases/get-all-shipment.use-case'
import { GetOneShipmentUseCase } from '@/modules/shipment/application/use-cases/get-one-shipment.use-case'
import { UpdateShipmentUseCase } from '@/modules/shipment/application/use-cases/update-shipment.use-case'
import { UpdateStatusShipmentUseCase } from '@/modules/shipment/application/use-cases/update-status-shipment.use-case'
import { ShipmentStatus } from '@/modules/shipment/domain/enums/shipment-status.enum'
import { CreateShipmentDto } from '@/modules/shipment/presentation/dtos/create-shipment-dto'
import { UpdateShipmentDto } from '@/modules/shipment/presentation/dtos/update-shipment-dto'
import { CheckPolicies } from '@/shared/infra/auth/decorators/check-policies.decorator'
import { CurrentUser } from '@/shared/infra/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from '@/shared/infra/auth/guards/jwt-auth.guard'
import { PoliciesGuard } from '@/shared/infra/auth/guards/policies.guard'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { CreateShipmentPolicy } from '@/shared/infra/auth/policies/shipment/create-shipment.policy'
import { DeleteShipmentPolicy } from '@/shared/infra/auth/policies/shipment/delete-shipment.policy'
import { ReadShipmentPolicy } from '@/shared/infra/auth/policies/shipment/read-shipment.policy'
import { UpdateShipmentPolicy } from '@/shared/infra/auth/policies/shipment/update-shipment.policy'
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Delete,
  Get,
  Patch,
  ParseEnumPipe
} from '@nestjs/common'
import { UUID } from 'crypto'

@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('shipments')
export class ShipmentController {
  constructor(
    private readonly createShipmentUseCase: CreateShipmentUseCase,
    private readonly deleteShipmentUseCase: DeleteShipmentUseCase,
    private readonly getAllShipmentUseCase: GetAllShipmentUseCase,
    private readonly getOneShipmentUseCase: GetOneShipmentUseCase,
    private readonly updateShipmentUseCase: UpdateShipmentUseCase,
    private readonly updateStatusShipmentUseCase: UpdateStatusShipmentUseCase
  ) {}

  @CheckPolicies(new ReadShipmentPolicy())
  @Get()
  async getAll(@CurrentUser() user: UserPayload) {
    return this.getAllShipmentUseCase.execute(user)
  }

  @CheckPolicies(new ReadShipmentPolicy())
  @Get(':id')
  async getOne(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    return this.getOneShipmentUseCase.execute(id, user)
  }

  @CheckPolicies(new CreateShipmentPolicy())
  @Post()
  async create(@Body() dto: CreateShipmentDto) {
    return this.createShipmentUseCase.execute(dto)
  }

  @CheckPolicies(new UpdateShipmentPolicy())
  @Patch(':id')
  async update(@Param('id') id: UUID, @Body() dto: UpdateShipmentDto) {
    return this.updateShipmentUseCase.execute(id, dto)
  }

  @CheckPolicies(new UpdateShipmentPolicy())
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: UUID,
    @Body('status', new ParseEnumPipe(ShipmentStatus)) status: ShipmentStatus
  ) {
    return this.updateStatusShipmentUseCase.execute(id, status)
  }

  @CheckPolicies(new DeleteShipmentPolicy())
  @Delete(':id')
  async delete(@Param('id') id: UUID) {
    return this.deleteShipmentUseCase.execute(id)
  }
}
