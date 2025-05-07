import { CreateSaleUseCase } from '@/modules/sale/application/use-cases/create/create-sale.use-case'
import { DeleteSaleUseCase } from '@/modules/sale/application/use-cases/delete-sale.use-case'
import { GetAllSaleUseCase } from '@/modules/sale/application/use-cases/get-all-sale.use-case'
import { GetOneSaleUseCase } from '@/modules/sale/application/use-cases/get-one/get-one-sale.use-case'
import { MarkInstallmentPaidUseCase } from '@/modules/sale/application/use-cases/mark-installment-paid.use-case'
import { UpdateSaleUseCase } from '@/modules/sale/application/use-cases/update/update-sale.use-case'
import { CreateSaleDto } from '@/modules/sale/presentation/dtos/create-sale.dto'
import { MarkInstallmentPaidDto } from '@/modules/sale/presentation/dtos/mark-installment-paid.dto'
import { CheckPolicies } from '@/shared/infra/auth/decorators/check-policies.decorator'
import { CurrentUser } from '@/shared/infra/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from '@/shared/infra/auth/guards/jwt-auth.guard'
import { PoliciesGuard } from '@/shared/infra/auth/guards/policies.guard'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { CreateSalePolicy } from '@/shared/infra/auth/policies/sale/create-sale.policy'
import { DeleteSalePolicy } from '@/shared/infra/auth/policies/sale/delete-sale.policy'
import { ReadSalePolicy } from '@/shared/infra/auth/policies/sale/read-sale.policy'
import { UpdateSalePolicy } from '@/shared/infra/auth/policies/sale/update-sale.policy'
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  Patch,
  Delete,
  UseInterceptors
} from '@nestjs/common'
import { UUID } from 'crypto'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBearerAuth
} from '@nestjs/swagger'
import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager'

@ApiTags('Sales')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('sales')
@UseInterceptors(CacheInterceptor)
export class SaleController {
  constructor(
    private readonly createSaleUseCase: CreateSaleUseCase,
    private readonly getAllSaleUseCase: GetAllSaleUseCase,
    private readonly getOneSaleUseCase: GetOneSaleUseCase,
    private readonly updateSaleUseCase: UpdateSaleUseCase,
    private readonly deleteSaleUseCase: DeleteSaleUseCase,
    private readonly markInstallmentPaidUseCase: MarkInstallmentPaidUseCase,
    private readonly logger: CustomLogger
  ) {}

  @ApiOperation({ summary: 'Get all sales' })
  @ApiResponse({
    status: 200,
    description: 'List of sales returned successfully',
    type: [Sale]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new ReadSalePolicy())
  @Get()
  @CacheKey('all-sales')
  @CacheTTL(300)
  async getAll(@CurrentUser() user: UserPayload) {
    this.logger.log(
      `Getting all sales - Requested by user ${user.email}`,
      'SaleController'
    )
    return await this.getAllSaleUseCase.execute(user)
  }

  @ApiOperation({ summary: 'Get a specific sale' })
  @ApiParam({ name: 'id', description: 'Sale ID' })
  @ApiResponse({ status: 200, description: 'Sale found successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Sale not found' })
  @CheckPolicies(new ReadSalePolicy())
  @Get(':id')
  async getOne(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    this.logger.log(
      `Getting sale ${id} - Requested by user ${user.email}`,
      'SaleController'
    )
    return await this.getOneSaleUseCase.execute(id, user)
  }

  @ApiOperation({ summary: 'Create a new sale' })
  @ApiBody({ type: CreateSaleDto })
  @ApiResponse({ status: 201, description: 'Sale created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new CreateSalePolicy())
  @Post()
  async create(@Body() dto: CreateSaleDto, @CurrentUser() user: UserPayload) {
    this.logger.warn(
      `Creating new sale - Requested by user ${user.email}`,
      'SaleController'
    )
    return await this.createSaleUseCase.execute(dto, user)
  }

  @ApiOperation({ summary: 'Update a sale' })
  @ApiParam({ name: 'id', description: 'Sale ID' })
  @ApiBody({ type: CreateSaleDto })
  @ApiResponse({ status: 200, description: 'Sale updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new UpdateSalePolicy())
  @Patch(':id')
  async update(
    @Param('id') id: UUID,
    @Body() dto: CreateSaleDto,
    @CurrentUser() user: UserPayload
  ) {
    this.logger.warn(
      `Updating sale ${id} - Requested by user ${user.email}`,
      'SaleController'
    )
    return this.updateSaleUseCase.execute(id, dto, user)
  }

  @ApiOperation({ summary: 'Delete a sale' })
  @ApiParam({ name: 'id', description: 'Sale ID' })
  @ApiResponse({ status: 200, description: 'Sale deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new DeleteSalePolicy())
  @Delete(':id')
  async delete(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    this.logger.warn(
      `Deleting sale ${id} - Requested by user ${user.email}`,
      'SaleController'
    )
    return await this.deleteSaleUseCase.execute(id, user)
  }

  @ApiOperation({ summary: 'Mark installment as paid' })
  @ApiParam({ name: 'id', description: 'Sale ID' })
  @ApiBody({ type: MarkInstallmentPaidDto })
  @ApiResponse({ status: 200, description: 'Installment marked as paid' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new UpdateSalePolicy())
  @Patch(':id/installments/mark-paid')
  async markInstallmentPaid(
    @Param('id') id: UUID,
    @Body() dto: MarkInstallmentPaidDto,
    @CurrentUser() user: UserPayload
  ) {
    this.logger.warn(
      `Marking installment ${dto.installmentNumber} as paid for sale ${id} - Requested by user ${user.email}`,
      'SaleController'
    )
    return await this.markInstallmentPaidUseCase.execute(id, dto)
  }
}
