import { CreateProductModelUseCase } from '@/modules/product-model/application/use-cases/create-product-model.use-case'
import { CreateProductModelDto } from '@/modules/product-model/presentation/dto/create-product-model.dto'
import { Controller, Post, Body } from '@nestjs/common'

@Controller('product-models')
export class ProductModelController {
  constructor(private readonly createUseCase: CreateProductModelUseCase) {}

  @Post()
  async create(@Body() dto: CreateProductModelDto) {
    return await this.createUseCase.execute(dto)
  }
}
