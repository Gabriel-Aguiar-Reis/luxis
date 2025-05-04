import { CreateProductModelUseCase } from '@/modules/product-model/application/use-cases/create-product-model.use-case'
import { DeleteProductModelUseCase } from '@/modules/product-model/application/use-cases/delete-product-model.use-case'
import { GetAllProductModelUseCase } from '@/modules/product-model/application/use-cases/get-all-product-model.use-case'
import { GetOneProductModelUseCase } from '@/modules/product-model/application/use-cases/get-one-product-model.use-case'
import { UpdateProductModelUseCase } from '@/modules/product-model/application/use-cases/update-product-model.use-case'
import { CreateProductModelDto } from '@/modules/product-model/presentation/dtos/create-product-model.dto'
import { UpdateProductModelDto } from '@/modules/product-model/presentation/dtos/update-product-model.dto'
import { JwtAuthGuard } from '@/shared/infra/auth/guards/jwt-auth.guard'
import { PoliciesGuard } from '@/shared/infra/auth/guards/policies.guard'
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Delete,
  Get
} from '@nestjs/common'

import { UUID } from 'crypto'
import { CheckPolicies } from '@/shared/infra/auth/decorators/check-policies.decorator'
import { ReadProductModelPolicy } from '@/shared/infra/auth/policies/product-model/read-product-model.policy'
import { CreateProductModelPolicy } from '@/shared/infra/auth/policies/product-model/create-product-model.policy'
import { UpdateProductModelPolicy } from '@/shared/infra/auth/policies/product-model/update-product-model.policy'
import { DeleteProductModelPolicy } from '@/shared/infra/auth/policies/product-model/delete-product-model.policy'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { CurrentUser } from '@/shared/infra/auth/decorators/current-user.decorator'
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('product-models')
export class ProductModelController {
  constructor(
    private readonly createProductModelUseCase: CreateProductModelUseCase,
    private readonly updateProductModelUseCase: UpdateProductModelUseCase,
    private readonly deleteProductModelUseCase: DeleteProductModelUseCase,
    private readonly getAllProductModelUseCase: GetAllProductModelUseCase,
    private readonly getOneProductModelUseCase: GetOneProductModelUseCase,
    private readonly logger: CustomLogger
  ) {}

  @CheckPolicies(new ReadProductModelPolicy())
  @Get()
  async getAll(@CurrentUser() user: UserPayload) {
    this.logger.log(
      `Getting all product models - Requested by user ${user.email}`,
      'ProductModelController'
    )
    return await this.getAllProductModelUseCase.execute()
  }

  @CheckPolicies(new ReadProductModelPolicy())
  @Get(':id')
  async getOne(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    this.logger.log(
      `Getting product model ${id} - Requested by user ${user.email}`,
      'ProductModelController'
    )
    return await this.getOneProductModelUseCase.execute(id)
  }

  @CheckPolicies(new CreateProductModelPolicy())
  @Post()
  async create(
    @Body() dto: CreateProductModelDto,
    @CurrentUser() user: UserPayload
  ) {
    this.logger.warn(
      `Creating new product model - Requested by user ${user.email}`,
      'ProductModelController'
    )
    return await this.createProductModelUseCase.execute(dto)
  }

  @CheckPolicies(new UpdateProductModelPolicy())
  @Patch(':id')
  async update(
    @Param('id') id: UUID,
    @Body() dto: UpdateProductModelDto,
    @CurrentUser() user: UserPayload
  ) {
    this.logger.warn(
      `Updating product model ${id} - Requested by user ${user.email}`,
      'ProductModelController'
    )
    return await this.updateProductModelUseCase.execute(id, dto)
  }

  @CheckPolicies(new DeleteProductModelPolicy())
  @Delete(':id')
  async delete(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    this.logger.warn(
      `Deleting product model ${id} - Requested by user ${user.email}`,
      'ProductModelController'
    )
    return await this.deleteProductModelUseCase.execute(id)
  }
}
