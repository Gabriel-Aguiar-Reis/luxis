import { CreateUserUseCase } from '@/modules/user/application/use-cases/create-user.use-case'
import { DeleteUserUseCase } from '@/modules/user/application/use-cases/delete-user.use-case'
import { DisableUserUseCase } from '@/modules/user/application/use-cases/disable-user.use-case'
import { GetAllUserUseCase } from '@/modules/user/application/use-cases/get-all-user.use-case'
import { GetOneUserUseCase } from '@/modules/user/application/use-cases/get-one-user.use-case'
import { UpdateUserRoleUseCase } from '@/modules/user/application/use-cases/update-user-role.use-case'
import { UpdateUserUseCase } from '@/modules/user/application/use-cases/update-user.use-case'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { CreateUserDto } from '@/modules/user/application/dtos/create-user.dto'
import { UpdateUserRoleDto } from '@/modules/user/application/dtos/update-user-role.dto'
import { UpdateUserDto } from '@/modules/user/application/dtos/update-user.dto'
import { CheckPolicies } from '@/shared/infra/auth/decorators/check-policies.decorator'
import { CurrentUser } from '@/shared/infra/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from '@/shared/infra/auth/guards/jwt-auth.guard'
import { PoliciesGuard } from '@/shared/infra/auth/guards/policies.guard'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { DeleteUserPolicy } from '@/shared/infra/auth/policies/user/delete-user.policy'
import { ReadUserPolicy } from '@/shared/infra/auth/policies/user/read-user.policy'
import { UpdateUserPolicy } from '@/shared/infra/auth/policies/user/update-sale.policy'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors
} from '@nestjs/common'
import { UUID } from 'crypto'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody
} from '@nestjs/swagger'
import { User } from '@/modules/user/domain/entities/user.entity'
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager'
import { CustomThrottlerGuard } from '@/shared/infra/guards/throttler.guard'
import { Throttle } from '@nestjs/throttler'
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PoliciesGuard, CustomThrottlerGuard)
@Controller('users')
@UseInterceptors(CacheInterceptor)
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getOneUserUseCase: GetOneUserUseCase,
    private readonly getAllUsersUseCase: GetAllUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly updateUserRoleUseCase: UpdateUserRoleUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly disableUserUseCase: DisableUserUseCase,
    private readonly logger: CustomLogger
  ) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users returned successfully',
    type: [User]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new ReadUserPolicy())
  @Get()
  @CacheKey('all-users')
  @CacheTTL(300)
  @Throttle({ default: { limit: 3, ttl: 60 * 1000 } })
  async getAll(@CurrentUser() user: UserPayload) {
    this.logger.log(
      `Getting all users - Requested by user ${user.email}`,
      'UserController'
    )
    return await this.getAllUsersUseCase.execute(user)
  }

  @ApiOperation({ summary: 'Get a specific user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User found successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @CheckPolicies(new ReadUserPolicy())
  @Get(':id')
  async getOne(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    this.logger.log(
      `Getting user ${id} - Requested by user ${user.email}`,
      'UserController'
    )
    return await this.getOneUserUseCase.execute(id, user)
  }

  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: User
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @Post('signup')
  @Throttle({ default: { limit: 3, ttl: 60 * 1000 } })
  async create(@Body() dto: CreateUserDto) {
    this.logger.warn(`Creating new user: ${dto.email}`, 'UserController')
    return await this.createUserUseCase.execute(dto)
  }

  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @CheckPolicies(new UpdateUserPolicy())
  @Patch(':id')
  async update(
    @Param('id') id: UUID,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: UserPayload
  ) {
    this.logger.warn(
      `Updating user ${id} - Requested by user ${user.email}`,
      'UserController'
    )
    return await this.updateUserUseCase.execute(id, dto, user)
  }

  @ApiOperation({ summary: 'Update a user role' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User role updated successfully'
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @CheckPolicies(new UpdateUserPolicy())
  @Patch(':id/role')
  async updateRole(
    @Param('id') id: UUID,
    @Body() dto: UpdateUserRoleDto,
    @CurrentUser() user: UserPayload
  ) {
    this.logger.warn(
      `Updating user ${id} role to ${dto.role} - Requested by user ${user.email}`,
      'UserController'
    )
    return await this.updateUserRoleUseCase.execute(id, dto, user)
  }

  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @CheckPolicies(new DeleteUserPolicy())
  @Delete(':id')
  async delete(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    this.logger.warn(
      `Deleting user ${id} - Requested by user ${user.email}`,
      'UserController'
    )
    return await this.deleteUserUseCase.execute(id)
  }

  @ApiOperation({ summary: 'Disable a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User disabled successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @CheckPolicies(new UpdateUserPolicy())
  @Patch(':id/disable')
  async disable(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    this.logger.warn(
      `Disabling user ${id} - Requested by user ${user.email}`,
      'UserController'
    )
    return await this.disableUserUseCase.execute(id, user)
  }
}
