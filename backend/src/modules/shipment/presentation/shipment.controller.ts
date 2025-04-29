import { CreateShipmentUseCase } from '@/modules/shipment/application/use-cases/create-shipment.use-case'
import { DeleteShipmentUseCase } from '@/modules/shipment/application/use-cases/delete-shipment.use-case'
import { GetAllShipmentUseCase } from '@/modules/shipment/application/use-cases/get-all-shipment.use-case'
import { GetOneShipmentUseCase } from '@/modules/shipment/application/use-cases/get-one-shipment.use-case'
import { UpdateShipmentUseCase } from '@/modules/shipment/application/use-cases/update-shipment.use-case'
import { UpdateStatusShipmentUseCase } from '@/modules/shipment/application/use-cases/update-status-shipment.use-case'
import { ShipmentStatus } from '@/modules/shipment/domain/enums/shipment-status.enum'
import { CreateShipmentDto } from '@/modules/shipment/presentation/dtos/create-shipment-dto'
import { UpdateShipmentDto } from '@/modules/shipment/presentation/dtos/update-shipment-dto'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { Roles } from '@/shared/infra/auth/decorators/roles.decorator'
import { RolesGuard } from '@/shared/infra/auth/guards/roles.guard'
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

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ASSISTANT)
  @Get()
  async getAll() {
    return this.getAllShipmentUseCase.execute()
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ASSISTANT)
  @Get(':id')
  async getOne(@Param('id') id: UUID) {
    return this.getOneShipmentUseCase.execute(id)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() dto: CreateShipmentDto) {
    return this.createShipmentUseCase.execute(dto)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: UUID, @Body() dto: UpdateShipmentDto) {
    return this.updateShipmentUseCase.execute(id, dto)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: UUID,
    @Body('status', new ParseEnumPipe(ShipmentStatus)) status: ShipmentStatus
  ) {
    return this.updateStatusShipmentUseCase.execute(id, status)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: UUID) {
    return this.deleteShipmentUseCase.execute(id)
  }
}
