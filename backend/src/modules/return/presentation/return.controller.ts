import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common'
import { CreateReturnUseCase } from '@/modules/return/application/use-cases/create-return.use-case'
import { DeleteReturnUseCase } from '@/modules/return/application/use-cases/delete-return.use-case'
import { GetAllReturnUseCase } from '@/modules/return/application/use-cases/get-all-return.use-case'
import { GetOneReturnUseCase } from '@/modules/return/application/use-cases/get-one-return.use-case'
import { UpdateReturnUseCase } from '@/modules/return/application/use-cases/update-return.use-case'
import { JwtAuthGuard } from '@/shared/infra/auth/guards/jwt-auth.guard'
import { PoliciesGuard } from '@/shared/infra/auth/guards/policies.guard'
import { CheckPolicies } from '@/shared/infra/auth/decorators/check-policies.decorator'
import { CreateReturnPolicy } from '@/shared/infra/auth/policies/return/create-return.policy'
import { CreateReturnDto } from '@/modules/return/application/dtos/create-return-dto'
import { ReadReturnPolicy } from '@/shared/infra/auth/policies/return/read-return.policy'
import { UUID } from 'crypto'
import { UpdateReturnPolicy } from '@/shared/infra/auth/policies/return/update-return.policy'
import { UpdateReturnDto } from '@/modules/return/application/dtos/update-return-dto'
import { DeleteReturnPolicy } from '@/shared/infra/auth/policies/return/delete-return.policy'
import { CurrentUser } from '@/shared/infra/auth/decorators/current-user.decorator'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { ReturnStatus } from '@/modules/return/domain/enums/return-status.enum'
import { UpdateReturnStatusUseCase } from '@/modules/return/application/use-cases/update-return-status.use-case'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiTags,
  ApiBearerAuth
} from '@nestjs/swagger'
import { Return } from '@/modules/return/domain/entities/return.entity'

@ApiTags('Returns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('returns')
export class ReturnController {
  constructor(
    private readonly createReturnUseCase: CreateReturnUseCase,
    private readonly getAllReturnUseCase: GetAllReturnUseCase,
    private readonly getOneReturnUseCase: GetOneReturnUseCase,
    private readonly updateReturnUseCase: UpdateReturnUseCase,
    private readonly deleteReturnUseCase: DeleteReturnUseCase,
    private readonly updateReturnStatusUseCase: UpdateReturnStatusUseCase,
    private readonly logger: CustomLogger
  ) {}

  @ApiOperation({ summary: 'Create a new return', operationId: 'createReturn' })
  @ApiBody({ type: CreateReturnDto })
  @ApiResponse({
    status: 201,
    description: 'Return created successfully',
    type: Return
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new CreateReturnPolicy())
  @HttpCode(201)
  @Post()
  async create(
    @Body() input: CreateReturnDto,
    @CurrentUser() user: UserPayload
  ) {
    this.logger.warn(
      `Creating new return - Requested by user ${user.email}`,
      'ReturnController'
    )
    return await this.createReturnUseCase.execute(input, user)
  }

  @ApiOperation({ summary: 'Get all returns', operationId: 'getAllReturns' })
  @ApiResponse({
    status: 200,
    description: 'List of returns returned successfully',
    type: [Return]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new ReadReturnPolicy())
  @HttpCode(200)
  @Get()
  async getAll(@CurrentUser() user: UserPayload) {
    this.logger.log(
      `Getting all returns - Requested by user ${user.email}`,
      'ReturnController'
    )
    return this.getAllReturnUseCase.execute(user)
  }

  @ApiOperation({
    summary: 'Get a specific return',
    operationId: 'getOneReturn'
  })
  @ApiParam({ name: 'id', description: 'Return ID' })
  @ApiResponse({
    status: 200,
    description: 'Return found successfully',
    type: Return
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Return not found' })
  @CheckPolicies(new ReadReturnPolicy())
  @HttpCode(200)
  @Get(':id')
  async getOne(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    this.logger.log(
      `Getting return ${id} - Requested by user ${user.email}`,
      'ReturnController'
    )
    return this.getOneReturnUseCase.execute(id, user)
  }

  @ApiOperation({ summary: 'Update a return', operationId: 'updateReturn' })
  @ApiParam({ name: 'id', description: 'Return ID' })
  @ApiBody({ type: UpdateReturnDto })
  @ApiResponse({
    status: 200,
    description: 'Return updated successfully',
    type: Return
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new UpdateReturnPolicy())
  @HttpCode(200)
  @Patch(':id')
  async update(
    @Param('id') id: UUID,
    @Body() input: UpdateReturnDto,
    @CurrentUser() user: UserPayload
  ) {
    this.logger.warn(
      `Updating return ${id} - Requested by user ${user.email}`,
      'ReturnController'
    )
    return await this.updateReturnUseCase.execute(id, input)
  }

  @ApiOperation({
    summary: 'Update the status of a return',
    operationId: 'updateReturnStatus'
  })
  @ApiParam({ name: 'id', description: 'Return ID' })
  @ApiBody({ type: UpdateReturnDto })
  @ApiResponse({
    status: 200,
    description: 'Return updated successfully',
    type: Return
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new UpdateReturnPolicy())
  @HttpCode(200)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: UUID,
    @Body() status: ReturnStatus,
    @CurrentUser() user: UserPayload
  ) {
    this.logger.warn(
      `Updating return status ${status} - Requested by user ${user.email}`,
      'ReturnController'
    )
    return await this.updateReturnStatusUseCase.execute(id, status, user)
  }

  @ApiOperation({
    summary: 'Delete a return',
    operationId: 'deleteReturn'
  })
  @ApiParam({ name: 'id', description: 'Return ID' })
  @ApiResponse({
    status: 204,
    description: 'Return deleted successfully',
    type: Return
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new DeleteReturnPolicy())
  @HttpCode(204)
  @Delete(':id')
  async delete(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    this.logger.warn(
      `Deleting return ${id} - Requested by user ${user.email}`,
      'ReturnController'
    )
    return await this.deleteReturnUseCase.execute(id)
  }
}
