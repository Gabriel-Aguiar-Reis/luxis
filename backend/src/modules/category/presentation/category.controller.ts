import { CreateCategoryUseCase } from '@/modules/category/application/use-cases/create-category.use-case'
import { DeleteCategoryUseCase } from '@/modules/category/application/use-cases/delete-category.use-case'
import { GetAllCategoryUseCase } from '@/modules/category/application/use-cases/get-all-category.use-case'
import { GetOneCategoryUseCase } from '@/modules/category/application/use-cases/get-one-category.use-case'
import { UpdateCategoryUseCase } from '@/modules/category/application/use-cases/update-category.use-case'
import { UpdateStatusCategoryUseCase } from '@/modules/category/application/use-cases/update-status-category.use-case'
import { CategoryStatus } from '@/modules/category/domain/enums/category.enum'
import { CreateCategoryDto } from '@/modules/category/presentation/dtos/create-category.dto'
import { UpdateCategoryDto } from '@/modules/category/presentation/dtos/update-category.dto'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { Roles } from '@/shared/infra/auth/decorators/roles.decorator'
import { RolesGuard } from '@/shared/infra/auth/guards/roles.guard'
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

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly getAllCategoryUseCase: GetAllCategoryUseCase,
    private readonly getOneCategoryUseCase: GetOneCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly updateStatusCategoryUseCase: UpdateStatusCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase
  ) {}

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ASSISTANT, Role.RESELLER)
  @Get()
  async getAll() {
    return await this.getAllCategoryUseCase.execute()
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ASSISTANT, Role.RESELLER)
  @Get(':id')
  async getOne(@Param('id') id: UUID) {
    return await this.getOneCategoryUseCase.execute(id)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ASSISTANT)
  @Post()
  async create(@Body() dto: CreateCategoryDto) {
    return await this.createCategoryUseCase.execute(dto)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ASSISTANT)
  @Patch(':id')
  async update(@Param('id') id: UUID, @Body() dto: UpdateCategoryDto) {
    return await this.updateCategoryUseCase.execute(id, dto)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ASSISTANT)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: UUID,
    @Body('status') status: CategoryStatus
  ) {
    return await this.updateStatusCategoryUseCase.execute(id, status)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: UUID) {
    return await this.deleteCategoryUseCase.execute(id)
  }
}
