import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Patch,
  UseGuards
} from '@nestjs/common'
import { CreateSupplierDto } from '@/modules/supplier/presentation/dtos/create-supplier.dto'
import { UpdateSupplierDto } from '@/modules/supplier/presentation/dtos/update-supplier.dto'
import { CreateSupplierUseCase } from '@/modules/supplier/application/use-cases/create-supplier.use-case'
import { UpdateSupplierUseCase } from '@/modules/supplier/application/use-cases/update-supplier.use-case'
import { DeleteSupplierUseCase } from '@/modules/supplier/application/use-cases/delete-supplier.use-case'
import { UUID } from 'crypto'
import { JwtAuthGuard } from '@/shared/infra/auth/guards/jwt-auth.guard'
import { PoliciesGuard } from '@/shared/infra/auth/guards/policies.guard'
import { CheckPolicies } from '@/shared/infra/auth/decorators/check-policies.decorator'
import { CreateSupplierPolicy } from '@/shared/infra/auth/policies/supplier/create-supplier.policy'
import { ReadSupplierPolicy } from '@/shared/infra/auth/policies/supplier/read-supplier.policy'
import { UpdateSupplierPolicy } from '@/shared/infra/auth/policies/supplier/update-supplier.policy'
import { DeleteSupplierPolicy } from '@/shared/infra/auth/policies/supplier/delete-supplier.policy'
import { GetAllSuppliersUseCase } from '@/modules/supplier/application/use-cases/get-all-supplier.use-case'
import { Supplier } from '@/modules/supplier/domain/entities/supplier.entity'
import { GetOneSuppliersUseCase } from '@/modules/supplier/application/use-cases/get-one-supplier.use-case'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { CurrentUser } from '@/shared/infra/auth/decorators/current-user.decorator'

@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('suppliers')
export class SupplierController {
  constructor(
    private readonly createSupplierUseCase: CreateSupplierUseCase,
    private readonly getAllSuppliersUseCase: GetAllSuppliersUseCase,
    private readonly getOneSupplierUseCase: GetOneSuppliersUseCase,
    private readonly updateSupplierUseCase: UpdateSupplierUseCase,
    private readonly deleteSupplierUseCase: DeleteSupplierUseCase,
    private readonly logger: CustomLogger
  ) {}

  @CheckPolicies(new CreateSupplierPolicy())
  @Post()
  async create(
    @Body() dto: CreateSupplierDto,
    @CurrentUser() user: UserPayload
  ): Promise<Supplier> {
    this.logger.warn(
      `Creating new supplier: ${dto.name} - Requested by user ${user.email}`,
      'SupplierController'
    )
    return await this.createSupplierUseCase.execute(dto)
  }

  @CheckPolicies(new ReadSupplierPolicy())
  @Get()
  async getAll(@CurrentUser() user: UserPayload): Promise<Supplier[]> {
    this.logger.log(
      `Getting all suppliers - Requested by user ${user.email}`,
      'SupplierController'
    )
    return await this.getAllSuppliersUseCase.execute()
  }

  @CheckPolicies(new ReadSupplierPolicy())
  @Get(':id')
  async getOne(
    @Param('id') id: UUID,
    @CurrentUser() user: UserPayload
  ): Promise<Supplier> {
    this.logger.log(
      `Getting supplier ${id} - Requested by user ${user.email}`,
      'SupplierController'
    )
    return await this.getOneSupplierUseCase.execute(id)
  }

  @CheckPolicies(new UpdateSupplierPolicy())
  @Patch(':id')
  async update(
    @Param('id') id: UUID,
    @Body() dto: UpdateSupplierDto,
    @CurrentUser() user: UserPayload
  ): Promise<Supplier> {
    this.logger.warn(
      `Updating supplier ${id} - Requested by user ${user.email}`,
      'SupplierController'
    )
    return await this.updateSupplierUseCase.execute(id, dto)
  }

  @CheckPolicies(new DeleteSupplierPolicy())
  @Delete(':id')
  async delete(
    @Param('id') id: UUID,
    @CurrentUser() user: UserPayload
  ): Promise<void> {
    this.logger.warn(
      `Deleting supplier ${id} - Requested by user ${user.email}`,
      'SupplierController'
    )
    await this.deleteSupplierUseCase.execute(id)
  }
}
