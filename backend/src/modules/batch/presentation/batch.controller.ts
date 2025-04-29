import { CreateBatchUseCase } from '@/modules/batch/application/use-cases/create-batch.use-case'
import { DeleteBatchUseCase } from '@/modules/batch/application/use-cases/delete-batch.use-case'
import { GetAllBatchUseCase } from '@/modules/batch/application/use-cases/get-all-batch.use-case'
import { GetOneBatchUseCase } from '@/modules/batch/application/use-cases/get-one-batch.use-case'
import { CreateBatchDto } from '@/modules/batch/presentation/dtos/create-batch.dto'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { Roles } from '@/shared/infra/auth/decorators/roles.decorator'
import { RolesGuard } from '@/shared/infra/auth/guards/roles.guard'
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Delete,
  Get
} from '@nestjs/common'
import { UUID } from 'crypto'

@Controller('batches')
export class BatchController {
  constructor(
    private readonly createBatchUseCase: CreateBatchUseCase,
    private readonly deleteBatchUseCase: DeleteBatchUseCase,
    private readonly getAllBatchUseCase: GetAllBatchUseCase,
    private readonly getOneBatchUseCase: GetOneBatchUseCase
  ) {}

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async getAll() {
    return this.getAllBatchUseCase.execute()
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  async getOne(@Param('id') id: UUID) {
    return this.getOneBatchUseCase.execute(id)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() dto: CreateBatchDto) {
    return this.createBatchUseCase.execute(dto)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: UUID) {
    return this.deleteBatchUseCase.execute(id)
  }
}
