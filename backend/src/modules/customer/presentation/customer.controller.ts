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
import { CreateCustomerDto } from '@/modules/customer/application/dtos/create-customer.dto'
import { CreateCustomerUseCase } from '@/modules/customer/application/use-cases/create-customer.use-case'
import { DeleteCustomerUseCase } from '@/modules/customer/application/use-cases/delete-customer.use-case'
import { UUID } from 'crypto'
import { JwtAuthGuard } from '@/shared/infra/auth/guards/jwt-auth.guard'
import { PoliciesGuard } from '@/shared/infra/auth/guards/policies.guard'
import { CheckPolicies } from '@/shared/infra/auth/decorators/check-policies.decorator'
import { CreateCustomerPolicy } from '@/shared/infra/auth/policies/customer/create-customer.policy'
import { ReadCustomerPolicy } from '@/shared/infra/auth/policies/customer/read-customer.policy'
import { UpdateCustomerPolicy } from '@/shared/infra/auth/policies/customer/update-customer.policy'
import { DeleteCustomerPolicy } from '@/shared/infra/auth/policies/customer/delete-customer.policy'
import { GetAllCustomerUseCase } from '@/modules/customer/application/use-cases/get-all-customer.use-case'
import { Customer } from '@/modules/customer/domain/entities/customer.entity'
import { GetOneCustomerUseCase } from '@/modules/customer/application/use-cases/get-one-customer.use-case'
import { UpdateCustomerUseCase } from '@/modules/customer/application/use-cases/update-customer.use-case'
import { UpdateCustomerDto } from '@/modules/customer/application/dtos/update-customer.dto'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { CurrentUser } from '@/shared/infra/auth/decorators/current-user.decorator'
import { TransferCustomerDto } from '@/modules/customer/application/dtos/transfer-customer.dto'
import { TransferCustomerUseCase } from '@/modules/customer/application/use-cases/transfer-customer.use-case'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiTags
} from '@nestjs/swagger'
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager'

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('customers')
@UseInterceptors(CacheInterceptor)
export class CustomerController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly getAllCustomersUseCase: GetAllCustomerUseCase,
    private readonly getOneCustomerUseCase: GetOneCustomerUseCase,
    private readonly updateCustomerUseCase: UpdateCustomerUseCase,
    private readonly deleteCustomerUseCase: DeleteCustomerUseCase,
    private readonly transferCustomerUseCase: TransferCustomerUseCase,
    private readonly logger: CustomLogger
  ) {}

  @ApiOperation({ summary: 'Create a new customer' })
  @ApiBody({ type: CreateCustomerDto })
  @ApiResponse({
    status: 201,
    description: 'Customer created successfully',
    type: Customer
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new CreateCustomerPolicy())
  @HttpCode(201)
  @Post()
  async create(
    @Body() dto: CreateCustomerDto,
    @CurrentUser() user: UserPayload
  ): Promise<Customer> {
    this.logger.warn(
      `Creating customer - Requested by user ${user.email}`,
      'CustomerController'
    )
    return await this.createCustomerUseCase.execute(dto, user)
  }

  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({
    status: 200,
    description: 'List of customers returned successfully',
    type: [Customer]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new ReadCustomerPolicy())
  @CacheKey('all-customers')
  @CacheTTL(300)
  @HttpCode(200)
  @Get()
  async getAll(@CurrentUser() user: UserPayload): Promise<Customer[]> {
    this.logger.log(
      `Getting all customers - Requested by user ${user.email}`,
      'CustomerController'
    )
    return await this.getAllCustomersUseCase.execute(user)
  }

  @ApiOperation({ summary: 'Get a specific customer' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({
    status: 200,
    description: 'Customer found successfully',
    type: Customer
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @CheckPolicies(new ReadCustomerPolicy())
  @HttpCode(200)
  @Get(':id')
  async getOne(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    this.logger.log(
      `Getting customer ${id} - Requested by user ${user.email}`,
      'CustomerController'
    )
    return await this.getOneCustomerUseCase.execute(id, user)
  }

  @ApiOperation({ summary: 'Update a customer' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiBody({ type: UpdateCustomerDto })
  @ApiResponse({
    status: 200,
    description: 'Customer updated successfully',
    type: Customer
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new UpdateCustomerPolicy())
  @HttpCode(200)
  @Patch(':id')
  async update(
    @Param('id') id: UUID,
    @Body() dto: UpdateCustomerDto,
    @CurrentUser() user: UserPayload
  ): Promise<Customer> {
    this.logger.warn(
      `Updating customer ${id} - Requested by user ${user.email}`,
      'CustomerController'
    )
    return await this.updateCustomerUseCase.execute(id, dto, user)
  }

  @ApiOperation({ summary: 'Delete a customer' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiParam({ name: 'fromResellerId', description: 'Reseller ID' })
  @ApiResponse({ status: 204, description: 'Customer deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new DeleteCustomerPolicy())
  @HttpCode(204)
  @Delete(':id/from/:fromResellerId')
  async delete(
    @Param('id') id: UUID,
    @Param('fromResellerId') fromResellerId: UUID,
    @CurrentUser() user: UserPayload
  ): Promise<void> {
    this.logger.warn(
      `Deleting customer ${id} from reseller ${fromResellerId} - Requested by user ${user.email}`,
      'CustomerController'
    )
    await this.deleteCustomerUseCase.execute(id, fromResellerId, user)
  }

  @ApiOperation({ summary: 'Transfer a customer' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiBody({ type: TransferCustomerDto })
  @ApiResponse({
    status: 204,
    description: 'Customer transferred successfully'
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new UpdateCustomerPolicy())
  @HttpCode(204)
  @Post(':id/transfer')
  async transfer(
    @Param('id') id: UUID,
    @Body() dto: TransferCustomerDto,
    @CurrentUser() user: UserPayload
  ): Promise<void> {
    this.logger.warn(
      `Transferring customer ${id} to reseller ${dto.toResellerId} - Requested by user ${user.email}`,
      'CustomerController'
    )
    await this.transferCustomerUseCase.execute(id, dto, user)
  }
}
