import { CreatePackingListUseCase } from '@/modules/packing-list/application/use-cases/create-packing-list.use-case'
import { DeletePackingListUseCase } from '@/modules/packing-list/application/use-cases/delete-packing-list.use-case'
import { GetAllPackingListUseCase } from '@/modules/packing-list/application/use-cases/get-all-packing-list.use-case'
import { GetOnePackingListUseCase } from '@/modules/packing-list/application/use-cases/get-one-packing-list.use-case'
import { UpdatePackingListUseCase } from '@/modules/packing-list/application/use-cases/update-packing-list.use-case'
import { UpdateStatusPackingListUseCase } from '@/modules/packing-list/application/use-cases/update-status-packing-list.use-case'
import { PackingListStatus } from '@/modules/packing-list/domain/enums/packing-list-status.enum'
import { CreatePackingListDto } from '@/modules/packing-list/presentation/dtos/create-packing-list.dto'
import { UpdatePackingListDto } from '@/modules/packing-list/presentation/dtos/update-packing-list.dto'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { Roles } from '@/shared/infra/auth/decorators/roles.decorator'
import { RolesGuard } from '@/shared/infra/auth/guards/roles.guard'
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards
} from '@nestjs/common'
import { UUID } from 'crypto'

@Controller('packing-list')
export class ProductController {
  constructor(
    private readonly createPackingListUseCase: CreatePackingListUseCase,
    private readonly getAllPackingListUseCase: GetAllPackingListUseCase,
    private readonly getOnePackingListUseCase: GetOnePackingListUseCase,
    private readonly updatePackingListUseCase: UpdatePackingListUseCase,
    private readonly deletePackingListUseCase: DeletePackingListUseCase,
    private readonly updateStatusPackingListUseCase: UpdateStatusPackingListUseCase
  ) {}

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ASSISTANT)
  @Get()
  async getAll() {
    return await this.getAllPackingListUseCase.execute()
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ASSISTANT)
  @Get(':id')
  async getOne(@Param('id') id: UUID) {
    return await this.getOnePackingListUseCase.execute(id)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ASSISTANT)
  @Post()
  async create(@Body() dto: CreatePackingListDto) {
    return await this.createPackingListUseCase.execute(dto)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ASSISTANT)
  @Patch(':id')
  async update(@Param('id') id: UUID, @Body() dto: UpdatePackingListDto) {
    return await this.updatePackingListUseCase.execute(id, dto)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ASSISTANT)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: UUID,
    @Body('status') status: PackingListStatus
  ) {
    return await this.updateStatusPackingListUseCase.execute(id, status)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ASSISTANT)
  @Delete(':id')
  async delete(@Param('id') id: UUID) {
    return await this.deletePackingListUseCase.execute(id)
  }
}
