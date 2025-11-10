import { CreateSaleUseCase } from '@/modules/sale/application/use-cases/create/create-sale.use-case'
import { ConfirmSaleUseCase } from '@/modules/sale/application/use-cases/confirm-sale.use-case'
import { DeleteSaleUseCase } from '@/modules/sale/application/use-cases/delete-sale.use-case'
import { GetAllSaleUseCase } from '@/modules/sale/application/use-cases/get-all-sale.use-case'
import { GetOneSaleUseCase } from '@/modules/sale/application/use-cases/get-one/get-one-sale.use-case'
import { MarkInstallmentPaidUseCase } from '@/modules/sale/application/use-cases/mark-installment-paid.use-case'
import { UpdateSaleUseCase } from '@/modules/sale/application/use-cases/update/update-sale.use-case'
import { CreateSaleDto } from '@/modules/sale/application/dtos/create-sale.dto'
import { MarkInstallmentPaidDto } from '@/modules/sale/application/dtos/mark-installment-paid.dto'
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
  UseInterceptors,
  HttpCode
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
import { UpdateSaleStatusUseCase } from '@/modules/sale/application/use-cases/update-sale-status.use-case'
import { UpdateSaleStatusDto } from '@/modules/sale/application/dtos/update-sale-status.dto'
import { GetSaleDto } from '@/modules/sale/application/dtos/get-sale.dto'
import { GetAvailableProductsToSellUseCase } from '@/modules/sale/application/use-cases/get-available-products-to-sell.use-case'
import { GetAvailableProductsToSellDto } from '@/modules/sale/application/dtos/get-available-products-to-sell.dto'
import { UpdateSaleDto } from '@/modules/sale/application/dtos/update-sale.dto'

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

    private readonly updateSaleStatusUseCase: UpdateSaleStatusUseCase,
    private readonly confirmSaleUseCase: ConfirmSaleUseCase,
    private readonly getAvailableProductsToSellUseCase: GetAvailableProductsToSellUseCase,
    private readonly deleteSaleUseCase: DeleteSaleUseCase,
    private readonly markInstallmentPaidUseCase: MarkInstallmentPaidUseCase,
    private readonly logger: CustomLogger
  ) {}

  @ApiOperation({ summary: 'Confirm a sale', operationId: 'confirmSale' })
  @ApiParam({
    name: 'id',
    description: 'sale ID',
    type: 'string',
    required: true
  })
  @HttpCode(204)
  @Patch(':id/confirm')
  async confirmSale(
    @Param('id') id: UUID,
    @CurrentUser() user: UserPayload
  ): Promise<void> {
    await this.confirmSaleUseCase.execute(id, user)
  }

  @ApiOperation({ summary: 'Get all sales', operationId: 'getAllSales' })
  @ApiResponse({
    status: 200,
    description: 'List of sales returned successfully',
    type: [GetSaleDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new ReadSalePolicy())
  @CacheKey('all-sales')
  @CacheTTL(300)
  @HttpCode(200)
  @Get()
  async getAll(@CurrentUser() user: UserPayload) {
    this.logger.log(
      `Getting all sales - Requested by user ${user.email}`,
      'SaleController'
    )
    return await this.getAllSaleUseCase.execute(user)
  }

  @ApiOperation({
    summary: 'Get available products to sell',
    operationId: 'getAvailableProductsToSell'
  })
  @ApiResponse({
    status: 200,
    description: 'List of available products to sell returned successfully',
    type: GetAvailableProductsToSellDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new ReadSalePolicy())
  @HttpCode(200)
  @Get('available-products')
  async getAvailableProductsToSell(
    @CurrentUser() user: UserPayload
  ): Promise<GetAvailableProductsToSellDto> {
    this.logger.log(
      `Getting available products to sell - Requested by user ${user.email}`,
      'SaleController'
    )
    return await this.getAvailableProductsToSellUseCase.execute(user)
  }

  @ApiOperation({ summary: 'Get a specific sale', operationId: 'getOneSale' })
  @ApiParam({ name: 'id', description: 'Sale ID' })
  @ApiResponse({
    status: 200,
    description: 'Sale found successfully',
    type: GetSaleDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Sale not found' })
  @CheckPolicies(new ReadSalePolicy())
  @HttpCode(200)
  @Get(':id')
  async getOne(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    this.logger.log(
      `Getting sale ${id} - Requested by user ${user.email}`,
      'SaleController'
    )
    return await this.getOneSaleUseCase.execute(id, user)
  }

  @ApiOperation({ summary: 'Create a new sale', operationId: 'createSale' })
  @ApiBody({ type: CreateSaleDto })
  @ApiResponse({
    status: 201,
    description: 'Sale created successfully',
    type: Sale
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new CreateSalePolicy())
  @HttpCode(201)
  @Post()
  async create(@Body() dto: CreateSaleDto, @CurrentUser() user: UserPayload) {
    this.logger.warn(
      `Creating new sale - Requested by user ${user.email}`,
      'SaleController'
    )
    return await this.createSaleUseCase.execute(dto, user)
  }

  @ApiOperation({ summary: 'Update a sale', operationId: 'updateSale' })
  @ApiParam({ name: 'id', description: 'Sale ID' })
  @ApiBody({ type: UpdateSaleDto })
  @ApiResponse({
    status: 200,
    description: 'Sale updated successfully',
    type: Sale
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new UpdateSalePolicy())
  @HttpCode(200)
  @Patch(':id')
  async update(
    @Param('id') id: UUID,
    @Body() dto: UpdateSaleDto,
    @CurrentUser() user: UserPayload
  ) {
    this.logger.warn(
      `Updating sale ${id} - Requested by user ${user.email}`,
      'SaleController'
    )
    return this.updateSaleUseCase.execute(id, dto, user)
  }

  @ApiOperation({ summary: 'Delete a sale', operationId: 'deleteSale' })
  @ApiParam({ name: 'id', description: 'Sale ID' })
  @ApiResponse({
    status: 204,
    description: 'Sale deleted successfully'
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new DeleteSalePolicy())
  @HttpCode(204)
  @Delete(':id')
  async delete(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    this.logger.warn(
      `Deleting sale ${id} - Requested by user ${user.email}`,
      'SaleController'
    )
    return await this.deleteSaleUseCase.execute(id, user)
  }

  @ApiOperation({
    summary: 'Mark installment as paid',
    operationId: 'markInstallmentPaid'
  })
  @ApiParam({ name: 'id', description: 'Sale ID' })
  @ApiBody({ type: MarkInstallmentPaidDto })
  @ApiResponse({
    status: 200,
    description: 'Installment marked as paid',
    type: Sale
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new UpdateSalePolicy())
  @HttpCode(200)
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

  @ApiOperation({
    summary: 'Update sale status',
    operationId: 'updateSaleStatus'
  })
  @ApiParam({ name: 'id', description: 'Sale ID' })
  @ApiBody({ type: UpdateSaleStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Sale status updated successfully',
    type: Sale
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new UpdateSalePolicy())
  @HttpCode(200)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: UUID,
    @Body() dto: UpdateSaleStatusDto,
    @CurrentUser() user: UserPayload
  ) {
    this.logger.warn(
      `Updating status for sale ${id} to ${dto.status} - Requested by user ${user.email}`,
      'SaleController'
    )
    return await this.updateSaleStatusUseCase.execute(id, dto)
  }
}
