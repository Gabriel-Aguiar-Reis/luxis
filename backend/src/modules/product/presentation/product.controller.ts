import { DeleteProductUseCase } from '@/modules/product/application/use-cases/delete-product.use-case'
import { GetAllProductUseCase } from '@/modules/product/application/use-cases/get-all-product.use-case'
import { GetOneProductUseCase } from '@/modules/product/application/use-cases/get-one-product.use-case'
import { SellProductUseCase } from '@/modules/product/application/use-cases/sell-product.use-case'
import { UpdateProductUseCase } from '@/modules/product/application/use-cases/update-product.use-case'
import { UpdateProductDto } from '@/modules/product/presentation/dtos/update-product.dto'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { CheckPolicies } from '@/shared/infra/auth/decorators/check-policies.decorator'
import { CurrentUser } from '@/shared/infra/auth/decorators/current-user.decorator'
import { Roles } from '@/shared/infra/auth/decorators/roles.decorator'
import { JwtAuthGuard } from '@/shared/infra/auth/guards/jwt-auth.guard'
import { PoliciesGuard } from '@/shared/infra/auth/guards/policies.guard'
import { RolesGuard } from '@/shared/infra/auth/guards/roles.guard'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { DeleteProductPolicy } from '@/shared/infra/auth/policies/product/delete-product.policy'
import { ReadProductPolicy } from '@/shared/infra/auth/policies/product/read-product.policy'
import { UpdateProductPolicy } from '@/shared/infra/auth/policies/product/update-product.policy'
import {
  Controller,
  Body,
  Patch,
  Param,
  Get,
  Delete,
  UseGuards
} from '@nestjs/common'
import { UUID } from 'crypto'

@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('products')
export class ProductController {
  constructor(
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly getAllProductUseCase: GetAllProductUseCase,
    private readonly getOneProductUseCase: GetOneProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly sellProductUseCase: SellProductUseCase
  ) {}

  @CheckPolicies(new ReadProductPolicy())
  @Get()
  async getAll(@CurrentUser() user: UserPayload) {
    return await this.getAllProductUseCase.execute(user)
  }

  @CheckPolicies(new ReadProductPolicy())
  @Get(':id')
  async getOne(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    return await this.getOneProductUseCase.execute(id, user)
  }

  @CheckPolicies(new UpdateProductPolicy())
  @Patch(':id')
  async update(@Param('id') id: UUID, @Body() dto: UpdateProductDto) {
    return await this.updateProductUseCase.execute(id, dto)
  }

  @CheckPolicies(new UpdateProductPolicy())
  @Patch(':id/sell')
  async sell(@Param('id') id: UUID) {
    return await this.sellProductUseCase.execute(id)
  }

  @CheckPolicies(new DeleteProductPolicy())
  @Delete(':id')
  async delete(@Param('id') id: UUID) {
    return await this.deleteProductUseCase.execute(id)
  }
}
