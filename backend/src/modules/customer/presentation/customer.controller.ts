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
import { CreateCustomerDto } from '@/modules/customer/presentation/dtos/create-customer.dto'
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
import { GetAllCustomersUseCase } from '@/modules/customer/application/use-cases/get-all-customer.use-case'
import { Customer } from '@/modules/customer/domain/entities/customer.entity'
import { GetOneCustomersUseCase } from '@/modules/customer/application/use-cases/get-one-customer.use-case'
import { UpdateCustomerUseCase } from '@/modules/customer/application/use-cases/update-customer.use-case'
import { UpdateCustomerDto } from '@/modules/customer/presentation/dtos/update-customer.dto'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { CurrentUser } from '@/shared/infra/auth/decorators/current-user.decorator'
import { TransferCustomerDto } from '@/modules/customer/presentation/dtos/transfer-customer.dto'
import { TransferCustomerUseCase } from '@/modules/customer/application/use-cases/transfer-customer.use-case'

@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('customers')
export class CustomerController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly getAllCustomersUseCase: GetAllCustomersUseCase,
    private readonly getOneCustomerUseCase: GetOneCustomersUseCase,
    private readonly updateCustomerUseCase: UpdateCustomerUseCase,
    private readonly deleteCustomerUseCase: DeleteCustomerUseCase,
    private readonly transferCustomerUseCase: TransferCustomerUseCase
  ) {}

  @CheckPolicies(new CreateCustomerPolicy())
  @Post()
  async create(
    @Body() dto: CreateCustomerDto,
    @CurrentUser() user: UserPayload
  ): Promise<Customer> {
    return await this.createCustomerUseCase.execute(dto, user)
  }

  @CheckPolicies(new ReadCustomerPolicy())
  @Get()
  async getAll(@CurrentUser() user: UserPayload): Promise<Customer[]> {
    return await this.getAllCustomersUseCase.execute(user)
  }

  @CheckPolicies(new ReadCustomerPolicy())
  @Get(':id')
  async getOne(
    @Param('id') id: UUID,
    @CurrentUser() user: UserPayload
  ): Promise<Customer> {
    return await this.getOneCustomerUseCase.execute(id, user)
  }

  @CheckPolicies(new UpdateCustomerPolicy())
  @Patch(':id')
  async update(
    @Param('id') id: UUID,
    @Body() dto: UpdateCustomerDto,
    @CurrentUser() user: UserPayload
  ): Promise<Customer> {
    return await this.updateCustomerUseCase.execute(id, dto, user)
  }

  @CheckPolicies(new DeleteCustomerPolicy())
  @Delete(':id/from/:fromResellerId')
  async delete(
    @Param('id') id: UUID,
    @Param('fromResellerId') fromResellerId: UUID
  ): Promise<void> {
    await this.deleteCustomerUseCase.execute(id, fromResellerId)
  }

  @CheckPolicies(new UpdateCustomerPolicy())
  @Post(':id/transfer')
  async transfer(
    @Param('id') id: UUID,
    @Body() dto: TransferCustomerDto,
    @CurrentUser() user: UserPayload
  ): Promise<void> {
    await this.transferCustomerUseCase.execute(id, dto, user)
  }
}
