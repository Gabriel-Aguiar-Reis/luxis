import { CreateProductUseCase } from '@/modules/product/application/use-cases/create-product.use-case'
import { CreateProductDto } from '@/modules/product/presentation/dtos/create-product.dto'
import { Controller, Post, Body } from '@nestjs/common'

@Controller('products')
export class ProductController {
  constructor(private readonly createProductUseCase: CreateProductUseCase) {}

  @Post()
  async create(@Body() dto: CreateProductDto) {
    const product = await this.createProductUseCase.execute(dto)
    return { ...product }
  }
}
