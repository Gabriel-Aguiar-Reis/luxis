import { CreateUserUseCase } from '@/modules/user/application/use-cases/create-user.use-case'
import { DeleteUserUseCase } from '@/modules/user/application/use-cases/delete-user.use-case'
import { DisableUserUseCase } from '@/modules/user/application/use-cases/disable-user.use-case'
import { GetAllUserUseCase } from '@/modules/user/application/use-cases/get-all-user.use-case'
import { GetOneUserUseCase } from '@/modules/user/application/use-cases/get-one-user.use-case'
import { UpdateUserRoleUseCase } from '@/modules/user/application/use-cases/update-user-role.use-case'
import { UpdateUserUseCase } from '@/modules/user/application/use-cases/update-user.use-case'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { CreateUserDto } from '@/modules/user/presentation/dtos/create-user.dto'
import { UpdateUserDto } from '@/modules/user/presentation/dtos/update-user.dto'
import { CheckPolicies } from '@/shared/infra/auth/decorators/check-policies.decorator'
import { CurrentUser } from '@/shared/infra/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from '@/shared/infra/auth/guards/jwt-auth.guard'
import { PoliciesGuard } from '@/shared/infra/auth/guards/policies.guard'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { DeleteUserPolicy } from '@/shared/infra/auth/policies/user/delete-user.policy'
import { ReadUserPolicy } from '@/shared/infra/auth/policies/user/read-user.policy'
import { UpdateUserPolicy } from '@/shared/infra/auth/policies/user/update-sale.policy'
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Patch,
  Delete
} from '@nestjs/common'
import { UUID } from 'crypto'

@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getOneUserUseCase: GetOneUserUseCase,
    private readonly getAllUsersUseCase: GetAllUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly updateUserRoleUseCase: UpdateUserRoleUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly disableUserUseCase: DisableUserUseCase
  ) {}

  @CheckPolicies(new ReadUserPolicy())
  @Get()
  async getAll(@CurrentUser() user: UserPayload) {
    return await this.getAllUsersUseCase.execute(user)
  }

  @CheckPolicies(new ReadUserPolicy())
  @Get(':id')
  async getOne(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    return await this.getOneUserUseCase.execute(id, user)
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return await this.createUserUseCase.execute(dto)
  }

  @CheckPolicies(new UpdateUserPolicy())
  @Patch(':id')
  async update(
    @Param('id') id: UUID,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: UserPayload
  ) {
    return await this.updateUserUseCase.execute(id, dto, user)
  }

  @CheckPolicies(new UpdateUserPolicy())
  @Patch(':id/role')
  async updateRole(
    @Param('id') id: UUID,
    @Body() role: Role,
    @CurrentUser() user: UserPayload
  ) {
    return await this.updateUserRoleUseCase.execute(id, role, user)
  }

  @CheckPolicies(new DeleteUserPolicy())
  @Delete(':id')
  async delete(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    return await this.deleteUserUseCase.execute(id)
  }

  @CheckPolicies(new UpdateUserPolicy())
  @Patch(':id/disable')
  async disable(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    return await this.disableUserUseCase.execute(id, user)
  }
}
