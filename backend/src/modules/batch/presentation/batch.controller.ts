import { CreateBatchUseCase } from '@/modules/batch/application/use-cases/create-batch.use-case'
import { DeleteBatchUseCase } from '@/modules/batch/application/use-cases/delete-batch.use-case'
import { GetAllBatchUseCase } from '@/modules/batch/application/use-cases/get-all-batch.use-case'
import { GetOneBatchUseCase } from '@/modules/batch/application/use-cases/get-one-batch.use-case'
import { CreateBatchDto } from '@/modules/batch/presentation/dtos/create-batch.dto'
import { CheckPolicies } from '@/shared/infra/auth/decorators/check-policies.decorator'
import { JwtAuthGuard } from '@/shared/infra/auth/guards/jwt-auth.guard'
import { PoliciesGuard } from '@/shared/infra/auth/guards/policies.guard'
import { CreateBatchPolicy } from '@/shared/infra/auth/policies/batch/create-batch.policy'
import { DeleteBatchPolicy } from '@/shared/infra/auth/policies/batch/delete-batch.policy'
import { ReadBatchPolicy } from '@/shared/infra/auth/policies/batch/read-batch.policy'
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Delete,
  Get
} from '@nestjs/common'
import { UUID } from 'crypto'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { CurrentUser } from '@/shared/infra/auth/decorators/current-user.decorator'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger'
import { ApiResponse } from '@nestjs/swagger'
import { Batch } from '@/modules/batch/domain/entities/batch.entity'

@ApiTags('Batches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('batches')
export class BatchController {
  constructor(
    private readonly createBatchUseCase: CreateBatchUseCase,
    private readonly deleteBatchUseCase: DeleteBatchUseCase,
    private readonly getAllBatchUseCase: GetAllBatchUseCase,
    private readonly getOneBatchUseCase: GetOneBatchUseCase,
    private readonly logger: CustomLogger
  ) {}

  @ApiOperation({ summary: 'Get all batches' })
  @ApiResponse({
    status: 200,
    description: 'List of batches returned successfully',
    type: [Batch]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new ReadBatchPolicy())
  @Get()
  async getAll(@CurrentUser() user: UserPayload) {
    this.logger.log(
      `Getting all batches - Requested by user ${user.email}`,
      'BatchController'
    )
    return this.getAllBatchUseCase.execute()
  }

  @ApiOperation({ summary: 'Get a specific batch' })
  @ApiParam({ name: 'id', description: 'Batch ID' })
  @ApiResponse({ status: 200, description: 'Batch found successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Batch not found' })
  @CheckPolicies(new ReadBatchPolicy())
  @Get(':id')
  async getOne(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    this.logger.log(
      `Getting batch ${id} - Requested by user ${user.email}`,
      'BatchController'
    )
    return this.getOneBatchUseCase.execute(id)
  }

  @ApiOperation({ summary: 'Create a new batch' })
  @ApiBody({ type: CreateBatchDto })
  @ApiResponse({ status: 201, description: 'Batch created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new CreateBatchPolicy())
  @Post()
  async create(@Body() dto: CreateBatchDto, @CurrentUser() user: UserPayload) {
    this.logger.warn(
      `Creating batch - Requested by user ${user.email}`,
      'BatchController'
    )
    return this.createBatchUseCase.execute(dto)
  }

  @ApiOperation({ summary: 'Delete a batch' })
  @ApiParam({ name: 'id', description: 'Batch ID' })
  @ApiResponse({ status: 200, description: 'Batch deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new DeleteBatchPolicy())
  @Delete(':id')
  async delete(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    this.logger.warn(
      `Deleting batch ${id} - Requested by user ${user.email}`,
      'BatchController'
    )
    return this.deleteBatchUseCase.execute(id)
  }
}
