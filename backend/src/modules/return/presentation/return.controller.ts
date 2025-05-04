import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
import { CreateReturnDto } from '@/modules/return/presentation/dtos/create-return-dto'
import { ReadReturnPolicy } from '@/shared/infra/auth/policies/return/read-return.policy'
import { UUID } from 'crypto'
import { UpdateReturnPolicy } from '@/shared/infra/auth/policies/return/update-return.policy'
import { UpdateReturnDto } from '@/modules/return/presentation/dtos/update-return-dto'
import { DeleteReturnPolicy } from '@/shared/infra/auth/policies/return/delete-return.policy'
import { CurrentUser } from '@/shared/infra/auth/decorators/current-user.decorator'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { ReturnStatus } from '@/modules/return/domain/enums/return-status.enum'
import { UpdateReturnStatusUseCase } from '@/modules/return/application/use-cases/update-return-status.use-case'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
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

  @CheckPolicies(new CreateReturnPolicy())
  @Post()
  async create(
    @Body() input: CreateReturnDto,
    @CurrentUser() user: UserPayload
  ) {
    this.logger.warn(
      `Creating new return - Requested by user ${user.email}`,
      'ReturnController'
    )
    await this.createReturnUseCase.execute(input, user)
  }

  @CheckPolicies(new ReadReturnPolicy())
  @Get()
  async getAll(@CurrentUser() user: UserPayload) {
    this.logger.log(
      `Getting all returns - Requested by user ${user.email}`,
      'ReturnController'
    )
    return this.getAllReturnUseCase.execute(user)
  }

  @CheckPolicies(new ReadReturnPolicy())
  @Get(':id')
  async getOne(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    this.logger.log(
      `Getting return ${id} - Requested by user ${user.email}`,
      'ReturnController'
    )
    return this.getOneReturnUseCase.execute(id, user)
  }

  @CheckPolicies(new UpdateReturnPolicy())
  @Put(':id')
  async update(
    @Param('id') id: UUID,
    @Body() input: UpdateReturnDto,
    @CurrentUser() user: UserPayload
  ) {
    this.logger.warn(
      `Updating return ${id} - Requested by user ${user.email}`,
      'ReturnController'
    )
    await this.updateReturnUseCase.execute(id, input)
  }

  @CheckPolicies(new UpdateReturnPolicy())
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: UUID,
    @Body() status: ReturnStatus,
    @CurrentUser() user: UserPayload
  ) {
    this.logger.warn(
      `Updating return status ${status} - Requested by user ${user.email}`,
      'ReturnController'
    )
    await this.updateReturnStatusUseCase.execute(id, status)
  }
  @CheckPolicies(new DeleteReturnPolicy())
  @Delete(':id')
  async delete(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    this.logger.warn(
      `Deleting return ${id} - Requested by user ${user.email}`,
      'ReturnController'
    )
    await this.deleteReturnUseCase.execute(id)
  }
}
