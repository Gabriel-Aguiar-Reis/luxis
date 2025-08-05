import { CreateProductModelUseCase } from '@/modules/product-model/application/use-cases/create-product-model.use-case'
import { DeleteProductModelUseCase } from '@/modules/product-model/application/use-cases/delete-product-model.use-case'
import { GetOneProductModelUseCase } from '@/modules/product-model/application/use-cases/get-one-product-model.use-case'
import { UpdateProductModelUseCase } from '@/modules/product-model/application/use-cases/update-product-model.use-case'
import { CreateProductModelDto } from '@/modules/product-model/application/dtos/create-product-model.dto'
import { UpdateProductModelDto } from '@/modules/product-model/application/dtos/update-product-model.dto'
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
  Get,
  UseInterceptors,
  HttpCode
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
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiTags,
  ApiBearerAuth
} from '@nestjs/swagger'
import { ProductModel } from '@/modules/product-model/domain/entities/product-model.entity'
import { GetAllProductModelUseCase } from '@/modules/product-model/application/use-cases/get-all/get-all-product-model.use-case'
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager'

@ApiTags('Product Models')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('product-models')
@UseInterceptors(CacheInterceptor)
export class ProductModelController {
  constructor(
    private readonly createProductModelUseCase: CreateProductModelUseCase,
    private readonly updateProductModelUseCase: UpdateProductModelUseCase,
    private readonly deleteProductModelUseCase: DeleteProductModelUseCase,
    private readonly getAllProductModelUseCase: GetAllProductModelUseCase,
    private readonly getOneProductModelUseCase: GetOneProductModelUseCase,
    private readonly logger: CustomLogger
  ) {}

  @ApiOperation({
    summary: 'Get Cloudinary upload signature',
    operationId: 'getCloudinarySignature'
  })
  @ApiResponse({ status: 200, description: 'Signature generated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new CreateProductModelPolicy())
  @HttpCode(200)
  @Get('cloudinary-signature')
  async getCloudinarySignature() {
    return await this.updateProductModelUseCase['cloudinaryService'].generateUploadSignature('products-models-images')
  }

  @ApiOperation({
    summary: 'Get all product models',
    operationId: 'getAllProductModels'
  })
  @ApiResponse({
    status: 200,
    description: 'List of product models returned successfully',
    type: [ProductModel]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new ReadProductModelPolicy())
  @CacheKey('all-product-models')
  @CacheTTL(300)
  @HttpCode(200)
  @Get()
  async getAll(@CurrentUser() user: UserPayload) {
    this.logger.log(
      `Getting all product models - Requested by user ${user.email}`,
      'ProductModelController'
    )
    return await this.getAllProductModelUseCase.execute(user)
  }

  @ApiOperation({
    summary: 'Get a specific product model',
    operationId: 'getOneProductModel'
  })
  @ApiParam({ name: 'id', description: 'Product model ID' })
  @ApiResponse({
    status: 200,
    description: 'Product model found successfully',
    type: ProductModel
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Product model not found' })
  @CheckPolicies(new ReadProductModelPolicy())
  @HttpCode(200)
  @Get(':id')
  async getOne(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    this.logger.log(
      `Getting product model ${id} - Requested by user ${user.email}`,
      'ProductModelController'
    )
    return await this.getOneProductModelUseCase.execute(id)
  }

  @ApiOperation({
    summary: 'Create a new product model',
    operationId: 'createProductModel'
  })
  @ApiBody({ type: CreateProductModelDto })
  @ApiResponse({
    status: 201,
    description: 'Product model created successfully',
    type: ProductModel
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new CreateProductModelPolicy())
  @HttpCode(201)
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

  @ApiOperation({
    summary: 'Update a product model',
    operationId: 'updateProductModel'
  })
  @ApiParam({ name: 'id', description: 'Product model ID' })
  @ApiBody({ type: UpdateProductModelDto })
  @ApiResponse({
    status: 200,
    description: 'Product model updated successfully',
    type: ProductModel
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new UpdateProductModelPolicy())
  @HttpCode(200)
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

  @ApiOperation({
    summary: 'Delete a product model',
    operationId: 'deleteProductModel'
  })
  @ApiParam({ name: 'id', description: 'Product model ID' })
  @ApiResponse({
    status: 204,
    description: 'Product model deleted successfully'
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new DeleteProductModelPolicy())
  @HttpCode(204)
  @Delete(':id')
  async delete(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    this.logger.warn(
      `Deleting product model ${id} - Requested by user ${user.email}`,
      'ProductModelController'
    )
    return await this.deleteProductModelUseCase.execute(id)
  }
}
