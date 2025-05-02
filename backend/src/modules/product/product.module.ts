import { InventoryService } from '@/modules/inventory/application/services/inventory.service'
import { CreateProductUseCase } from '@/modules/product/application/use-cases/create-product.use-case'
import { DeleteProductUseCase } from '@/modules/product/application/use-cases/delete-product.use-case'
import { GetAllProductUseCase } from '@/modules/product/application/use-cases/get-all-product.use-case'
import { GetOneProductUseCase } from '@/modules/product/application/use-cases/get-one-product.use-case'
import { UpdateProductUseCase } from '@/modules/product/application/use-cases/update-product.use-case'
import { ProductController } from '@/modules/product/presentation/product.controller'
import { ProductTypeOrmRepository } from '@/shared/infra/persistence/typeorm/product/product.typeorm.repository'
import { Module } from '@nestjs/common'

@Module({
  controllers: [ProductController],
  providers: [
    CreateProductUseCase,
    GetOneProductUseCase,
    GetAllProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    { provide: 'ProductRepository', useClass: ProductTypeOrmRepository },
    { provide: 'InventoryService', useClass: InventoryService }
  ]
})
export class ProductModule {}
