import { CreateProductModelUseCase } from '@/modules/product-model/application/use-cases/create-product-model.use-case'
import { DeleteProductModelUseCase } from '@/modules/product-model/application/use-cases/delete-product-model.use-case'
import { GetAllProductModelUseCase } from '@/modules/product-model/application/use-cases/get-all-product-model.use-case'
import { GetOneProductModelUseCase } from '@/modules/product-model/application/use-cases/get-one-product-model.use-case'
import { UpdateProductModelUseCase } from '@/modules/product-model/application/use-cases/update-product-model.use-case'
import { ProductModelController } from '@/modules/product-model/presentation/product-model.controller'
import { ProductModelTypeOrmRepository } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.repository'
import { Module } from '@nestjs/common'

@Module({
  controllers: [ProductModelController],
  providers: [
    CreateProductModelUseCase,
    GetAllProductModelUseCase,
    GetOneProductModelUseCase,
    UpdateProductModelUseCase,
    DeleteProductModelUseCase,
    {
      provide: 'ProductModelRepository',
      useClass: ProductModelTypeOrmRepository
    }
  ]
})
export class ProductModelModule {}
