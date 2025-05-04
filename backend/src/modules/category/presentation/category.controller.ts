import { CreateCategoryUseCase } from '@/modules/category/application/use-cases/create-category.use-case'
import { DeleteCategoryUseCase } from '@/modules/category/application/use-cases/delete-category.use-case'
import { GetAllCategoryUseCase } from '@/modules/category/application/use-cases/get-all-category.use-case'
import { GetOneCategoryUseCase } from '@/modules/category/application/use-cases/get-one-category.use-case'
import { UpdateCategoryUseCase } from '@/modules/category/application/use-cases/update-category.use-case'
import { UpdateStatusCategoryUseCase } from '@/modules/category/application/use-cases/update-status-category.use-case'
import { CategoryStatus } from '@/modules/category/domain/enums/category.enum'
import { CreateCategoryDto } from '@/modules/category/presentation/dtos/create-category.dto'
import { UpdateCategoryDto } from '@/modules/category/presentation/dtos/update-category.dto'
import { CheckPolicies } from '@/shared/infra/auth/decorators/check-policies.decorator'
import { JwtAuthGuard } from '@/shared/infra/auth/guards/jwt-auth.guard'
import { PoliciesGuard } from '@/shared/infra/auth/guards/policies.guard'
import { CreateCategoryPolicy } from '@/shared/infra/auth/policies/category/create-category.policy'
import { DeleteCategoryPolicy } from '@/shared/infra/auth/policies/category/delete-category.policy'
import { ReadCategoryPolicy } from '@/shared/infra/auth/policies/category/read-category.policy'
import { UpdateCategoryPolicy } from '@/shared/infra/auth/policies/category/update-category.policy'
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete
} from '@nestjs/common'
import { UUID } from 'crypto'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { CurrentUser } from '@/shared/infra/auth/decorators/current-user.decorator'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('categories')
export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly getAllCategoryUseCase: GetAllCategoryUseCase,
    private readonly getOneCategoryUseCase: GetOneCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly updateStatusCategoryUseCase: UpdateStatusCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
    private readonly logger: CustomLogger
  ) {}

  @CheckPolicies(new ReadCategoryPolicy())
  @Get()
  async getAll(@CurrentUser() user: UserPayload) {
    this.logger.log(
      `Getting all categories - Requested by user ${user.email}`,
      'CategoryController'
    )
    return await this.getAllCategoryUseCase.execute()
  }

  @CheckPolicies(new ReadCategoryPolicy())
  @Get(':id')
  async getOne(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    this.logger.log(
      `Getting category ${id} - Requested by user ${user.email}`,
      'CategoryController'
    )
    return await this.getOneCategoryUseCase.execute(id)
  }

  @CheckPolicies(new CreateCategoryPolicy())
  @Post()
  async create(
    @Body() dto: CreateCategoryDto,
    @CurrentUser() user: UserPayload
  ) {
    this.logger.warn(
      `Creating category - Requested by user ${user.email}`,
      'CategoryController'
    )
    return await this.createCategoryUseCase.execute(dto)
  }

  @CheckPolicies(new UpdateCategoryPolicy())
  @Patch(':id')
  async update(
    @Param('id') id: UUID,
    @Body() dto: UpdateCategoryDto,
    @CurrentUser() user: UserPayload
  ) {
    this.logger.warn(
      `Updating category ${id} - Requested by user ${user.email}`,
      'CategoryController'
    )
    return await this.updateCategoryUseCase.execute(id, dto)
  }
  @CheckPolicies(new UpdateCategoryPolicy())
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: UUID,
    @Body('status') status: CategoryStatus,
    @CurrentUser() user: UserPayload
  ) {
    this.logger.warn(
      `Updating status of category ${id} to ${status} - Requested by user ${user.email}`,
      'CategoryController'
    )
    return await this.updateStatusCategoryUseCase.execute(id, status)
  }

  @CheckPolicies(new DeleteCategoryPolicy())
  @Delete(':id')
  async delete(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    this.logger.warn(
      `Deleting category ${id} - Requested by user ${user.email}`,
      'CategoryController'
    )
    return await this.deleteCategoryUseCase.execute(id)
  }
}
