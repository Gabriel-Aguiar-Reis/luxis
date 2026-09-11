import { DeleteProductUseCase } from '@/modules/product/application/use-cases/delete-product.use-case'
import { GetAllProductUseCase } from '@/modules/product/application/use-cases/get-all-product.use-case'
import { GetOneProductUseCase } from '@/modules/product/application/use-cases/get-one-product.use-case'
import { SellProductUseCase } from '@/modules/product/application/use-cases/sell-product.use-case'
import { UpdateProductUseCase } from '@/modules/product/application/use-cases/update-product.use-case'
import { GetAvailableProductsUseCase } from '@/modules/product/application/use-cases/get-available-products.use-case'
import { UpdateProductDto } from '@/modules/product/application/dtos/update-product.dto'
import { CheckPolicies } from '@/shared/infra/auth/decorators/check-policies.decorator'
import { CurrentUser } from '@/shared/infra/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from '@/shared/infra/auth/guards/jwt-auth.guard'
import { PoliciesGuard } from '@/shared/infra/auth/guards/policies.guard'
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
  UseGuards,
  HttpCode
} from '@nestjs/common'
import { UUID } from 'crypto'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiTags,
  ApiBearerAuth
} from '@nestjs/swagger'
import { ProductResponseDto } from '@/modules/product/application/dtos/product-response.dto'
import { ProductResponseMapper } from '@/modules/product/application/mappers/product-response.mapper'

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('products')
export class ProductController {
  constructor(
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly getAllProductUseCase: GetAllProductUseCase,
    private readonly getOneProductUseCase: GetOneProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly sellProductUseCase: SellProductUseCase,
    private readonly getAvailableProductsUseCase: GetAvailableProductsUseCase,
    private readonly logger: CustomLogger
  ) {}

  @ApiOperation({ summary: 'Get all products', operationId: 'getAllProducts' })
  @ApiResponse({
    status: 200,
    description: 'List of products returned successfully',
    type: [ProductResponseDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new ReadProductPolicy())
  @HttpCode(200)
  @Get()
  async getAll(@CurrentUser() user: UserPayload) {
    this.logger.log(
      `Getting all products - Requested by user ${user.email}`,
      'ProductController'
    )
    const products = await this.getAllProductUseCase.execute(user)
    return ProductResponseMapper.toDtoList(products)
  }

  @ApiOperation({
    summary: 'Get available products (IN_STOCK)',
    operationId: 'getAvailableProducts'
  })
  @ApiResponse({
    status: 200,
    description: 'List of available products returned successfully',
    type: [ProductResponseDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new ReadProductPolicy())
  @HttpCode(200)
  @Get('available/in-stock')
  async getAvailable(@CurrentUser() user: UserPayload) {
    this.logger.log(
      `Getting available products - Requested by user ${user.email}`,
      'ProductController'
    )
    const products = await this.getAvailableProductsUseCase.execute()
    return ProductResponseMapper.toDtoList(products)
  }

  @ApiOperation({
    summary: 'Get a specific product',
    operationId: 'getOneProduct'
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product found successfully',
    type: ProductResponseDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @CheckPolicies(new ReadProductPolicy())
  @HttpCode(200)
  @Get(':id')
  async getOne(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    this.logger.log(
      `Getting product ${id} - Requested by user ${user.email}`,
      'ProductController'
    )
    const product = await this.getOneProductUseCase.execute(id, user)
    return ProductResponseMapper.toDto(product)
  }

  @ApiOperation({ summary: 'Update a product', operationId: 'updateProduct' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: ProductResponseDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new UpdateProductPolicy())
  @HttpCode(200)
  @Patch(':id')
  async update(
    @Param('id') id: UUID,
    @Body() dto: UpdateProductDto,
    @CurrentUser() user: UserPayload
  ) {
    this.logger.warn(
      `Updating product ${id} - Requested by user ${user.email}`,
      'ProductController'
    )
    const product = await this.updateProductUseCase.execute(id, dto)
    return ProductResponseMapper.toDto(product)
  }

  @ApiOperation({ summary: 'Sell a product', operationId: 'sellProduct' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 204, description: 'Product sold successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new UpdateProductPolicy())
  @HttpCode(204)
  @Patch(':id/sell')
  async sell(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    this.logger.warn(
      `Selling product ${id} - Requested by user ${user.email}`,
      'ProductController'
    )
    return await this.sellProductUseCase.execute(id)
  }

  @ApiOperation({ summary: 'Delete a product', operationId: 'deleteProduct' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 204, description: 'Product deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @CheckPolicies(new DeleteProductPolicy())
  @HttpCode(204)
  @Delete(':id')
  async delete(@Param('id') id: UUID, @CurrentUser() user: UserPayload) {
    this.logger.warn(
      `Deleting product ${id} - Requested by user ${user.email}`,
      'ProductController'
    )
    return await this.deleteProductUseCase.execute(id)
  }
}
