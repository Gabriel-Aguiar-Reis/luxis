import { CreateProductUseCase } from '@/modules/product/application/use-cases/create-product.use-case'
import { DeleteProductUseCase } from '@/modules/product/application/use-cases/delete-product.use-case'
import { GetAllProductUseCase } from '@/modules/product/application/use-cases/get-all-product.use-case'
import { GetOneProductUseCase } from '@/modules/product/application/use-cases/get-one-product.use-case'
import { UpdateProductUseCase } from '@/modules/product/application/use-cases/update-product.use-case'
import { CreateProductDto } from '@/modules/product/presentation/dtos/create-product.dto'
import { UpdateProductDto } from '@/modules/product/presentation/dtos/update-product.dto'
import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  Delete
} from '@nestjs/common'
import { UUID } from 'crypto'

@Controller('products')
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly getAllProductUseCase: GetAllProductUseCase,
    private readonly getOneProductUseCase: GetOneProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase
  ) {}

  @Get()
  async getAll() {
    return await this.getAllProductUseCase.execute()
  }

  @Get(':id')
  async getOne(@Param('id') id: UUID) {
    return await this.getOneProductUseCase.execute(id)
  }

  @Post()
  async create(@Body() dto: CreateProductDto) {
    return await this.createProductUseCase.execute(dto)
  }

  @Patch(':id')
  async update(@Param('id') id: UUID, @Body() dto: UpdateProductDto) {
    return await this.updateProductUseCase.execute(id, dto)
  }

  @Delete(':id')
  async delete(@Param('id') id: UUID) {
    return await this.deleteProductUseCase.execute(id)
  }
}
