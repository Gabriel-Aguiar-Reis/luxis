import { CreateSaleUseCase } from '@/modules/sale/application/use-cases/create/create-sale.use-case'
import { DeleteSaleUseCase } from '@/modules/sale/application/use-cases/delete-sale.use-case'
import { GetAllSaleUseCase } from '@/modules/sale/application/use-cases/get-all-sale.use-case'
import { GetOneSaleUseCase } from '@/modules/sale/application/use-cases/get-one/get-one-sale.use-case'
import { MarkInstallmentPaidUseCase } from '@/modules/sale/application/use-cases/mark-installment-paid/mark-installment-paid.use-case'
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
  Delete
} from '@nestjs/common'
import { UUID } from 'crypto'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('sales')
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

  @CheckPolicies(new ReadSalePolicy())
  @Get()
  async getAll(@CurrentUser() user: UserPayload) {
    this.logger.log(
      `Getting all sales - Requested by user ${user.email}`,
      'SaleController'
    )
    return await this.getAllSaleUseCase.execute(user)
  }

  @CheckPolicies(new ReadSalePolicy())
  @Get(':id')
  async getOne(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    this.logger.log(
      `Getting sale ${id} - Requested by user ${user.email}`,
      'SaleController'
    )
    return await this.getOneSaleUseCase.execute(id, user)
  }

  @CheckPolicies(new CreateSalePolicy())
  @Post()
  async create(@Body() dto: CreateSaleDto, @CurrentUser() user: UserPayload) {
    this.logger.warn(
      `Creating new sale - Requested by user ${user.email}`,
      'SaleController'
    )
    return await this.createSaleUseCase.execute(dto, user)
  }

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

  @CheckPolicies(new DeleteSalePolicy())
  @Delete(':id')
  async delete(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    this.logger.warn(
      `Deleting sale ${id} - Requested by user ${user.email}`,
      'SaleController'
    )
    return await this.deleteSaleUseCase.execute(id, user)
  }

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
