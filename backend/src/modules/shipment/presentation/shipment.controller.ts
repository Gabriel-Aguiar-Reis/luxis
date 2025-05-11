import { CreateShipmentUseCase } from '@/modules/shipment/application/use-cases/create-shipment.use-case'
import { DeleteShipmentUseCase } from '@/modules/shipment/application/use-cases/delete-shipment.use-case'
import { GetAllShipmentUseCase } from '@/modules/shipment/application/use-cases/get-all-shipment.use-case'
import { GetOneShipmentUseCase } from '@/modules/shipment/application/use-cases/get-one-shipment.use-case'
import { UpdateShipmentUseCase } from '@/modules/shipment/application/use-cases/update-shipment.use-case'
import { UpdateStatusShipmentUseCase } from '@/modules/shipment/application/use-cases/update-status-shipment.use-case'
import { ShipmentStatus } from '@/modules/shipment/domain/enums/shipment-status.enum'
import { CreateShipmentDto } from '@/modules/shipment/application/dtos/create-shipment-dto'
import { UpdateShipmentDto } from '@/modules/shipment/application/dtos/update-shipment-dto'
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
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBearerAuth
} from '@nestjs/swagger'
import { Shipment } from '@/modules/shipment/domain/entities/shipment.entity'

@ApiTags('Shipments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('shipments')
export class ShipmentController {
  constructor(
    private readonly createShipmentUseCase: CreateShipmentUseCase,
    private readonly deleteShipmentUseCase: DeleteShipmentUseCase,
    private readonly getAllShipmentUseCase: GetAllShipmentUseCase,
    private readonly getOneShipmentUseCase: GetOneShipmentUseCase,
    private readonly updateShipmentUseCase: UpdateShipmentUseCase,
    private readonly updateStatusShipmentUseCase: UpdateStatusShipmentUseCase,
    private readonly logger: CustomLogger
  ) {}

  @ApiOperation({ summary: 'Get all shipments' })
  @ApiResponse({
    status: 200,
    description: 'List of shipments returned successfully',
    type: [Shipment]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new ReadShipmentPolicy())
  @Get()
  async getAll(@CurrentUser() user: UserPayload) {
    this.logger.log(
      `Getting all shipments - Requested by user ${user.email}`,
      'ShipmentController'
    )
    return this.getAllShipmentUseCase.execute(user)
  }

  @ApiOperation({ summary: 'Get a specific shipment' })
  @ApiParam({ name: 'id', description: 'Shipment ID' })
  @ApiResponse({ status: 200, description: 'Shipment found successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Shipment not found' })
  @CheckPolicies(new ReadShipmentPolicy())
  @Get(':id')
  async getOne(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    this.logger.log(
      `Getting shipment ${id} - Requested by user ${user.email}`,
      'ShipmentController'
    )
    return this.getOneShipmentUseCase.execute(id, user)
  }

  @ApiOperation({ summary: 'Create a new shipment' })
  @ApiBody({ type: CreateShipmentDto })
  @ApiResponse({ status: 201, description: 'Shipment created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new CreateShipmentPolicy())
  @Post()
  async create(
    @Body() dto: CreateShipmentDto,
    @CurrentUser() user: UserPayload
  ) {
    this.logger.warn(
      `Creating new shipment to reseller ${dto.resellerId} - Requested by user ${user.email}`,
      'ShipmentController'
    )
    return this.createShipmentUseCase.execute(dto)
  }

  @ApiOperation({ summary: 'Update a shipment' })
  @ApiParam({ name: 'id', description: 'Shipment ID' })
  @ApiBody({ type: UpdateShipmentDto })
  @ApiResponse({ status: 200, description: 'Shipment updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new UpdateShipmentPolicy())
  @Patch(':id')
  async update(
    @Param('id') id: UUID,
    @Body() dto: UpdateShipmentDto,
    @CurrentUser() user: UserPayload
  ) {
    this.logger.warn(
      `Updating shipment ${id} to reseller ${dto.resellerId} - Requested by user ${user.email}`,
      'ShipmentController'
    )
    return this.updateShipmentUseCase.execute(id, dto)
  }

  @ApiOperation({ summary: 'Update the status of a shipment' })
  @ApiParam({ name: 'id', description: 'Shipment ID' })
  @ApiBody({ type: UpdateShipmentDto })
  @ApiResponse({ status: 200, description: 'Shipment updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new UpdateShipmentPolicy())
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: UUID,
    @Body('status', new ParseEnumPipe(ShipmentStatus)) status: ShipmentStatus,
    @CurrentUser() user: UserPayload
  ) {
    this.logger.warn(
      `Updating status of shipment ${id} to ${status} - Requested by user ${user.email}`,
      'ShipmentController'
    )
    return this.updateStatusShipmentUseCase.execute(id, status, user)
  }

  @ApiOperation({ summary: 'Delete a shipment' })
  @ApiParam({ name: 'id', description: 'Shipment ID' })
  @ApiResponse({ status: 200, description: 'Shipment deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new DeleteShipmentPolicy())
  @Delete(':id')
  async delete(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    this.logger.warn(
      `Deleting shipment ${id} - Requested by user ${user.email}`,
      'ShipmentController'
    )
    return this.deleteShipmentUseCase.execute(id)
  }
}
