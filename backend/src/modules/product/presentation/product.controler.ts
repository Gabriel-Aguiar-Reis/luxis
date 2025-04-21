import { CreateProductUseCase } from '@/modules/product/application/use-cases/create-product.use-case'
import { DeleteProductUseCase } from '@/modules/product/application/use-cases/delete-product.use-case'
import { GetAllProductUseCase } from '@/modules/product/application/use-cases/get-all-product.use-case'
import { GetOneProductUseCase } from '@/modules/product/application/use-cases/get-one-product.use-case'
import { SellProductUseCase } from '@/modules/product/application/use-cases/sell-product.use-case'
import { UpdateProductUseCase } from '@/modules/product/application/use-cases/update-product.use-case'
import { CreateProductDto } from '@/modules/product/presentation/dtos/create-product.dto'
import { UpdateProductDto } from '@/modules/product/presentation/dtos/update-product.dto'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { Roles } from '@/shared/infra/auth/decorators/roles.decorator'
import { RolesGuard } from '@/shared/infra/auth/guards/roles.guard'
import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  Delete,
  UseGuards
} from '@nestjs/common'
import { UUID } from 'crypto'

@Controller('products')
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly getAllProductUseCase: GetAllProductUseCase,
    private readonly getOneProductUseCase: GetOneProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly sellProductUseCase: SellProductUseCase
  ) {}

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ASSISTANT)
  @Get()
  async getAll() {
    return await this.getAllProductUseCase.execute()
  }
  // TODO -> inserir ABAC com CASL para permitir apenas adm, sup e self seller
  @Get(':id')
  async getOne(@Param('id') id: UUID) {
    return await this.getOneProductUseCase.execute(id)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ASSISTANT)
  @Post()
  async create(@Body() dto: CreateProductDto) {
    return await this.createProductUseCase.execute(dto)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ASSISTANT)
  @Patch(':id')
  async update(@Param('id') id: UUID, @Body() dto: UpdateProductDto) {
    return await this.updateProductUseCase.execute(id, dto)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ASSISTANT, Role.RESELLER)
  @Patch(':id/sell')
  async sell(@Param('id') id: UUID) {
    return await this.sellProductUseCase.execute(id)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ASSISTANT)
  @Delete(':id')
  async delete(@Param('id') id: UUID) {
    return await this.deleteProductUseCase.execute(id)
  }
}
