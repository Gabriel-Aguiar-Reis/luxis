import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
  HttpCode
} from '@nestjs/common'
import { CreateSupplierDto } from '@/modules/supplier/application/dtos/create-supplier.dto'
import { UpdateSupplierDto } from '@/modules/supplier/application/dtos/update-supplier.dto'
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
import { GetAllSupplierUseCase } from '@/modules/supplier/application/use-cases/get-all-supplier.use-case'
import { Supplier } from '@/modules/supplier/domain/entities/supplier.entity'
import { GetOneSupplierUseCase } from '@/modules/supplier/application/use-cases/get-one-supplier.use-case'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { CurrentUser } from '@/shared/infra/auth/decorators/current-user.decorator'
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiTags,
  ApiBearerAuth
} from '@nestjs/swagger'
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager'

@ApiTags('Suppliers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('suppliers')
@UseInterceptors(CacheInterceptor)
export class SupplierController {
  constructor(
    private readonly createSupplierUseCase: CreateSupplierUseCase,
    private readonly getAllSupplierUseCase: GetAllSupplierUseCase,
    private readonly getOneSupplierUseCase: GetOneSupplierUseCase,
    private readonly updateSupplierUseCase: UpdateSupplierUseCase,
    private readonly deleteSupplierUseCase: DeleteSupplierUseCase,
    private readonly logger: CustomLogger
  ) {}

  @ApiOperation({
    summary: 'Create a new supplier',
    operationId: 'createSupplier'
  })
  @ApiBody({ type: CreateSupplierDto })
  @ApiResponse({
    status: 201,
    description: 'Supplier created successfully',
    type: Supplier
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new CreateSupplierPolicy())
  @HttpCode(201)
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

  @ApiOperation({
    summary: 'Get all suppliers',
    operationId: 'getAllSuppliers'
  })
  @ApiResponse({
    status: 200,
    description: 'List of suppliers returned successfully',
    type: [Supplier]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new ReadSupplierPolicy())
  @CacheKey('all-suppliers')
  @CacheTTL(300)
  @HttpCode(200)
  @Get()
  async getAll(@CurrentUser() user: UserPayload): Promise<Supplier[]> {
    this.logger.log(
      `Getting all suppliers - Requested by user ${user.email}`,
      'SupplierController'
    )
    return await this.getAllSupplierUseCase.execute()
  }

  @ApiOperation({
    summary: 'Get a specific supplier',
    operationId: 'getOneSupplier'
  })
  @ApiParam({ name: 'id', description: 'Supplier ID' })
  @ApiResponse({
    status: 200,
    description: 'Supplier found successfully',
    type: Supplier
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Supplier not found' })
  @CheckPolicies(new ReadSupplierPolicy())
  @HttpCode(200)
  @Get(':id')
  async getOne(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    this.logger.log(
      `Getting supplier ${id} - Requested by user ${user.email}`,
      'SupplierController'
    )
    return await this.getOneSupplierUseCase.execute(id)
  }

  @ApiOperation({ summary: 'Update a supplier', operationId: 'updateSupplier' })
  @ApiParam({ name: 'id', description: 'Supplier ID' })
  @ApiBody({ type: UpdateSupplierDto })
  @ApiResponse({
    status: 200,
    description: 'Supplier updated successfully',
    type: Supplier
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new UpdateSupplierPolicy())
  @HttpCode(200)
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

  @ApiOperation({
    summary: 'Delete a supplier',
    operationId: 'deleteSupplier'
  })
  @ApiParam({ name: 'id', description: 'Supplier ID' })
  @ApiResponse({ status: 204, description: 'Supplier deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new DeleteSupplierPolicy())
  @HttpCode(204)
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
