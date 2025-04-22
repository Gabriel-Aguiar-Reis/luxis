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
import { Roles } from '@/shared/infra/auth/decorators/roles.decorator'
import { RolesGuard } from '@/shared/infra/auth/guards/roles.guard'
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

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ASSISTANT)
  @Get()
  async getAll() {
    return await this.getAllUsersUseCase.execute()
  }

  // TODO -> ABAC c/ CASL para reseller se ver e admin/sup ver tudo
  @Get(':id')
  async getOne(@Param('id') id: UUID) {
    return await this.getOneUserUseCase.execute(id)
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return await this.createUserUseCase.execute(dto)
  }

  // TODO -> ABAC c/ CASL para reseller se editar e admin/sup editar tudo
  @Patch(':id')
  async update(@Param('id') id: UUID, @Body() dto: UpdateUserDto) {
    return await this.updateUserUseCase.execute(id, dto)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id/role')
  async updateRole(@Param('id') id: UUID, @Body() role: Role) {
    return await this.updateUserRoleUseCase.execute(id, role)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: UUID) {
    return await this.deleteUserUseCase.execute(id)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id/disable')
  async disable(@Param('id') id: UUID) {
    return await this.disableUserUseCase.execute(id)
  }
}
