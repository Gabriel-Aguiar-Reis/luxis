import { ProductModel } from '@/modules/product-model/domain/entities/product-model.entity'
import { ProductModelRepository } from '@/modules/product-model/domain/repository/product-model.repository'
import { ProductModelOrmEntity } from '@/shared/infra/persistence/typeorm/product-model/product-model.orm-entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class ProductModelRepositoryImpl implements ProductModelRepository {
  constructor(
    @InjectRepository(ProductModelOrmEntity)
    private readonly repo: Repository<ProductModelOrmEntity>
  ) {}

  findAll(): Promise<ProductModel[]> {
    throw new Error('Method not implemented.')
  }
  findById(id: string): Promise<ProductModel | null> {
    throw new Error('Method not implemented.')
  }
  create(model: ProductModel): Promise<ProductModel> {
    throw new Error('Method not implemented.')
  }
  update(model: ProductModel): Promise<ProductModel> {
    throw new Error('Method not implemented.')
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
