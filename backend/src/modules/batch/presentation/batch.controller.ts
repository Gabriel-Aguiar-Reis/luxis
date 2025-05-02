import { CreateBatchUseCase } from '@/modules/batch/application/use-cases/create-batch.use-case'
import { DeleteBatchUseCase } from '@/modules/batch/application/use-cases/delete-batch.use-case'
import { GetAllBatchUseCase } from '@/modules/batch/application/use-cases/get-all-batch.use-case'
import { GetOneBatchUseCase } from '@/modules/batch/application/use-cases/get-one-batch.use-case'
import { CreateBatchDto } from '@/modules/batch/presentation/dtos/create-batch.dto'
import { CheckPolicies } from '@/shared/infra/auth/decorators/check-policies.decorator'
import { JwtAuthGuard } from '@/shared/infra/auth/guards/jwt-auth.guard'
import { PoliciesGuard } from '@/shared/infra/auth/guards/policies.guard'
import { CreateBatchPolicy } from '@/shared/infra/auth/policies/batch/create-batch.policy'
import { DeleteBatchPolicy } from '@/shared/infra/auth/policies/batch/delete-batch.policy'
import { ReadBatchPolicy } from '@/shared/infra/auth/policies/batch/read-batch.policy'
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

@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('batches')
export class BatchController {
  constructor(
    private readonly createBatchUseCase: CreateBatchUseCase,
    private readonly deleteBatchUseCase: DeleteBatchUseCase,
    private readonly getAllBatchUseCase: GetAllBatchUseCase,
    private readonly getOneBatchUseCase: GetOneBatchUseCase
  ) {}

  @CheckPolicies(new ReadBatchPolicy())
  @Get()
  async getAll() {
    return this.getAllBatchUseCase.execute()
  }

  @CheckPolicies(new ReadBatchPolicy())
  @Get(':id')
  async getOne(@Param('id') id: UUID) {
    return this.getOneBatchUseCase.execute(id)
  }

  @CheckPolicies(new CreateBatchPolicy())
  @Post()
  async create(@Body() dto: CreateBatchDto) {
    return this.createBatchUseCase.execute(dto)
  }

  @CheckPolicies(new DeleteBatchPolicy())
  @Delete(':id')
  async delete(@Param('id') id: UUID) {
    return this.deleteBatchUseCase.execute(id)
  }
}
