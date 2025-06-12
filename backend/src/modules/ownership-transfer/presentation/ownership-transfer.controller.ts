import { OwnershipTransferStatus } from '@/modules/ownership-transfer/domain/enums/ownership-transfer-status.enum'
import { CreateOwnershipTransferUseCase } from '@/modules/ownership-transfer/application/use-cases/create-ownership-transfer.use-case'
import { DeleteOwnershipTransferUseCase } from '@/modules/ownership-transfer/application/use-cases/delete-ownership-transfer.use-case'
import { GetAllOwnershipTransferUseCase } from '@/modules/ownership-transfer/application/use-cases/get-all-ownership-transfer.use-case'
import { GetOneOwnershipTransferUseCase } from '@/modules/ownership-transfer/application/use-cases/get-one-ownership-transfer.use-case'
import { UpdateOwnershipTransferUseCase } from '@/modules/ownership-transfer/application/use-cases/update-ownership-transfer.use-case'
import { CreateOwnershipTransferDto } from '@/modules/ownership-transfer/application/dtos/create-ownership-transfer.dto'
import { UpdateOwnershipTransferDto } from '@/modules/ownership-transfer/application/dtos/update-ownership-transfer.dto'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import {
  Controller,
  Post,
  Body,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
  HttpCode
} from '@nestjs/common'
import { UUID } from 'crypto'
import { UpdateStatusOwnershipTransferUseCase } from '@/modules/ownership-transfer/application/use-cases/update-status-ownership-transfer.use-case'
import { JwtAuthGuard } from '@/shared/infra/auth/guards/jwt-auth.guard'
import { PoliciesGuard } from '@/shared/infra/auth/guards/policies.guard'
import { CheckPolicies } from '@/shared/infra/auth/decorators/check-policies.decorator'
import { ReadOwnershipTransferPolicy } from '@/shared/infra/auth/policies/ownership-transfer/read-ownership-transfer.policy'
import { CreateOwnershipTransferPolicy } from '@/shared/infra/auth/policies/ownership-transfer/create-ownership-transfer.policy'
import { DeleteOwnershipTransferPolicy } from '@/shared/infra/auth/policies/ownership-transfer/delete-ownership-transfer.policy'
import { UpdateOwnershipTransferPolicy } from '@/shared/infra/auth/policies/ownership-transfer/update-ownership-transfer.policy'
import { CurrentUser } from '@/shared/infra/auth/decorators/current-user.decorator'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiTags,
  ApiBearerAuth
} from '@nestjs/swagger'
import { OwnershipTransfer } from '@/modules/ownership-transfer/domain/entities/ownership-transfer.entity'

@ApiTags('Ownership Transfers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('ownership-transfers')
export class OwnershipTransferController {
  constructor(
    private readonly createOwnershipTransferUseCase: CreateOwnershipTransferUseCase,
    private readonly updateOwnershipTransferUseCase: UpdateOwnershipTransferUseCase,
    private readonly getAllOwnershipTransferUseCase: GetAllOwnershipTransferUseCase,
    private readonly getOneOwnershipTransferUseCase: GetOneOwnershipTransferUseCase,
    private readonly deleteOwnershipTransferUseCase: DeleteOwnershipTransferUseCase,
    private readonly updateStatusOwnershipTransferUseCase: UpdateStatusOwnershipTransferUseCase,
    private readonly logger: CustomLogger
  ) {}

  @ApiOperation({ summary: 'Get all ownership transfers' })
  @ApiResponse({
    status: 200,
    description: 'List of ownership transfers returned successfully',
    type: [OwnershipTransfer]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new ReadOwnershipTransferPolicy())
  @HttpCode(200)
  @Get()
  async getAll(@CurrentUser() user: UserPayload) {
    this.logger.log(
      `Getting all ownership transfers - Requested by user ${user.email}`,
      'OwnershipTransferController'
    )
    return await this.getAllOwnershipTransferUseCase.execute(user)
  }

  @ApiOperation({ summary: 'Get a specific ownership transfer' })
  @ApiParam({ name: 'id', description: 'Ownership transfer ID' })
  @ApiResponse({
    status: 200,
    description: 'Ownership transfer found successfully',
    type: OwnershipTransfer
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Ownership transfer not found' })
  @CheckPolicies(new ReadOwnershipTransferPolicy())
  @HttpCode(200)
  @Get(':id')
  async getOne(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    this.logger.log(
      `Getting ownership transfer ${id} - Requested by user ${user.email}`,
      'OwnershipTransferController'
    )
    return await this.getOneOwnershipTransferUseCase.execute(id, user)
  }

  @ApiOperation({ summary: 'Create a new ownership transfer' })
  @ApiBody({ type: CreateOwnershipTransferDto })
  @ApiResponse({
    status: 201,
    description: 'Ownership transfer created successfully',
    type: OwnershipTransfer
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new CreateOwnershipTransferPolicy())
  @HttpCode(201)
  @Post()
  async create(
    @Body() dto: CreateOwnershipTransferDto,
    @CurrentUser() user: UserPayload
  ) {
    this.logger.warn(
      `Creating ownership transfer - Requested by user ${user.email}`,
      'OwnershipTransferController'
    )
    return await this.createOwnershipTransferUseCase.execute(dto, user)
  }

  @ApiOperation({ summary: 'Update a ownership transfer' })
  @ApiParam({ name: 'id', description: 'Ownership transfer ID' })
  @ApiBody({ type: UpdateOwnershipTransferDto })
  @ApiResponse({
    status: 200,
    description: 'Ownership transfer updated successfully',
    type: OwnershipTransfer
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new UpdateOwnershipTransferPolicy())
  @HttpCode(200)
  @Patch(':id')
  async update(
    @Param('id') id: UUID,
    @Body() dto: UpdateOwnershipTransferDto,
    @CurrentUser() user: UserPayload
  ) {
    this.logger.warn(
      `Updating ownership transfer ${id} - Requested by user ${user.email}`,
      'OwnershipTransferController'
    )
    return await this.updateOwnershipTransferUseCase.execute(id, dto)
  }

  @ApiOperation({ summary: 'Update the status of a ownership transfer' })
  @ApiParam({ name: 'id', description: 'Ownership transfer ID' })
  @ApiBody({ type: UpdateOwnershipTransferDto })
  @ApiResponse({
    status: 200,
    description: 'Ownership transfer updated successfully'
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new UpdateOwnershipTransferPolicy())
  @HttpCode(200)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: UUID,
    @Body('status') status: OwnershipTransferStatus,
    @CurrentUser() user: UserPayload
  ) {
    this.logger.warn(
      `Updating status of ownership transfer ${id} to ${status} - Requested by user ${user.email}`,
      'OwnershipTransferController'
    )
    return await this.updateStatusOwnershipTransferUseCase.execute(
      id,
      status,
      user
    )
  }

  @ApiOperation({ summary: 'Delete a ownership transfer' })
  @ApiParam({ name: 'id', description: 'Ownership transfer ID' })
  @ApiResponse({
    status: 204,
    description: 'Ownership transfer deleted successfully'
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new DeleteOwnershipTransferPolicy())
  @HttpCode(204)
  @Delete(':id')
  async delete(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    this.logger.warn(
      `Deleting ownership transfer ${id} - Requested by user ${user.email}`,
      'OwnershipTransferController'
    )
    return await this.deleteOwnershipTransferUseCase.execute(id)
  }
}
