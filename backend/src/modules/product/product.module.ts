import { CreateProductUseCase } from '@/modules/product/application/use-cases/create-product.use-case'
import { DeleteProductUseCase } from '@/modules/product/application/use-cases/delete-product.use-case'
import { GetAllProductUseCase } from '@/modules/product/application/use-cases/get-all-product.use-case'
import { GetOneProductUseCase } from '@/modules/product/application/use-cases/get-one-product.use-case'
import { UpdateProductUseCase } from '@/modules/product/application/use-cases/update-product.use-case'
import { ProductController } from '@/modules/product/presentation/product.controller'
import { Module } from '@nestjs/common'

// TODO -> Preciso colocar as implementações concretas para todos os tokens deste module
@Module({
  controllers: [ProductController],
  providers: [
    CreateProductUseCase,
    GetOneProductUseCase,
    GetAllProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase
  ]
})
export class ProductModule {}
