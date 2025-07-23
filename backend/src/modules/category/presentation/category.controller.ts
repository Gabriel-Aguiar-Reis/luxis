import { CreateCategoryUseCase } from '@/modules/category/application/use-cases/create-category.use-case'
import { DeleteCategoryUseCase } from '@/modules/category/application/use-cases/delete-category.use-case'
import { GetAllCategoryUseCase } from '@/modules/category/application/use-cases/get-all-category.use-case'
import { GetOneCategoryUseCase } from '@/modules/category/application/use-cases/get-one-category.use-case'
import { UpdateCategoryUseCase } from '@/modules/category/application/use-cases/update-category.use-case'
import { UpdateStatusCategoryUseCase } from '@/modules/category/application/use-cases/update-status-category.use-case'
import { CategoryStatus } from '@/modules/category/domain/enums/category.enum'
import { CreateCategoryDto } from '@/modules/category/application/dtos/create-category.dto'
import { UpdateCategoryDto } from '@/modules/category/application/dtos/update-category.dto'
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
  Delete,
  UseInterceptors,
  HttpCode
} from '@nestjs/common'
import { UUID } from 'crypto'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
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
import { Category } from '@/modules/category/domain/entities/category.entity'
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager'

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('categories')
@UseInterceptors(CacheInterceptor)
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

  @ApiOperation({
    summary: 'Get all categories',
    operationId: 'getAllCategories'
  })
  @ApiResponse({
    status: 200,
    description: 'List of categories returned successfully',
    type: [Category]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new ReadCategoryPolicy())
  @CacheTTL(300)
  @CacheKey('all-categories')
  @HttpCode(200)
  @Get()
  async getAll(@CurrentUser() user: UserPayload) {
    this.logger.log(
      `Getting all categories - Requested by user ${user.email}`,
      'CategoryController'
    )
    return await this.getAllCategoryUseCase.execute()
  }

  @ApiOperation({
    summary: 'Get a specific category',
    operationId: 'getOneCategory'
  })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Category found successfully',
    type: Category
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @CheckPolicies(new ReadCategoryPolicy())
  @HttpCode(200)
  @Get(':id')
  async getOne(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    this.logger.log(
      `Getting category ${id} - Requested by user ${user.email}`,
      'CategoryController'
    )
    return await this.getOneCategoryUseCase.execute(id)
  }

  @ApiOperation({
    summary: 'Create a new category',
    operationId: 'createCategory'
  })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    type: Category
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new CreateCategoryPolicy())
  @HttpCode(201)
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

  @ApiOperation({ summary: 'Update a category', operationId: 'updateCategory' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
    type: Category
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new UpdateCategoryPolicy())
  @HttpCode(200)
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

  @ApiOperation({
    summary: 'Update the status of a category',
    operationId: 'updateCategoryStatus'
  })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
    type: Category
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new UpdateCategoryPolicy())
  @HttpCode(200)
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

  @ApiOperation({
    summary: 'Delete a category',
    operationId: 'deleteCategory'
  })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({
    status: 204,
    description: 'Category deleted successfully',
    type: Category
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new DeleteCategoryPolicy())
  @HttpCode(204)
  @Delete(':id')
  async delete(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    this.logger.warn(
      `Deleting category ${id} - Requested by user ${user.email}`,
      'CategoryController'
    )
    await this.deleteCategoryUseCase.execute(id)
  }
}
