import { OwnershipTransferStatus } from '@/modules/ownership-transfer/domain/enums/ownership-transfer-status.enum'
import { CreateOwnershipTransferUseCase } from '@/modules/ownership-transfer/application/use-cases/create-ownership-transfer.use-case'
import { DeleteOwnershipTransferUseCase } from '@/modules/ownership-transfer/application/use-cases/delete-ownership-transfer.use-case'
import { GetAllOwnershipTransferUseCase } from '@/modules/ownership-transfer/application/use-cases/get-all-ownership-transfer.use-case'
import { GetOneOwnershipTransferUseCase } from '@/modules/ownership-transfer/application/use-cases/get-one-ownership-transfer.use-case'
import { UpdateOwnershipTransferUseCase } from '@/modules/ownership-transfer/application/use-cases/update-ownership-transfer.use-case'
import { CreateOwnershipTransferDto } from '@/modules/ownership-transfer/presentation/dtos/create-ownership-transfer.dto'
import { UpdateOwnershipTransferDto } from '@/modules/ownership-transfer/presentation/dtos/update-ownership-transfer.dto'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { Roles } from '@/shared/infra/auth/decorators/roles.decorator'
import { RolesGuard } from '@/shared/infra/auth/guards/roles.guard'
import {
  Controller,
  Post,
  Body,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards
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

@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('ownership-transfers')
export class OwnershipTransferController {
  constructor(
    private readonly createOwnershipTransferUseCase: CreateOwnershipTransferUseCase,
    private readonly updateOwnershipTransferUseCase: UpdateOwnershipTransferUseCase,
    private readonly getAllOwnershipTransferUseCase: GetAllOwnershipTransferUseCase,
    private readonly getOneOwnershipTransferUseCase: GetOneOwnershipTransferUseCase,
    private readonly deleteOwnershipTransferUseCase: DeleteOwnershipTransferUseCase,
    private readonly updateStatusOwnershipTransferUseCase: UpdateStatusOwnershipTransferUseCase
  ) {}

  @CheckPolicies(new ReadOwnershipTransferPolicy())
  @Get()
  async getAll(@CurrentUser() user: UserPayload) {
    return await this.getAllOwnershipTransferUseCase.execute(user)
  }

  @CheckPolicies(new ReadOwnershipTransferPolicy())
  @Get(':id')
  async getOne(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    return await this.getOneOwnershipTransferUseCase.execute(id, user)
  }

  @CheckPolicies(new CreateOwnershipTransferPolicy())
  @Post()
  async create(
    @Body() dto: CreateOwnershipTransferDto,
    @CurrentUser() user: UserPayload
  ) {
    return await this.createOwnershipTransferUseCase.execute(dto, user)
  }

  @CheckPolicies(new UpdateOwnershipTransferPolicy())
  @Patch(':id')
  async update(@Param('id') id: UUID, @Body() dto: UpdateOwnershipTransferDto) {
    return await this.updateOwnershipTransferUseCase.execute(id, dto)
  }

  @CheckPolicies(new UpdateOwnershipTransferPolicy())
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: UUID,
    @Body('status') status: OwnershipTransferStatus
  ) {
    return await this.updateStatusOwnershipTransferUseCase.execute(id, status)
  }

  @CheckPolicies(new DeleteOwnershipTransferPolicy())
  @Delete(':id')
  async delete(@Param('id') id: UUID) {
    return await this.deleteOwnershipTransferUseCase.execute(id)
  }
}
